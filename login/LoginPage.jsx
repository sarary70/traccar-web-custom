import { useEffect, useState } from 'react';
import {
  useMediaQuery, Select, MenuItem, FormControl, Button, TextField, Link, Snackbar, 
  IconButton, Tooltip, Box, InputAdornment, Typography, Divider, Fade, Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import ReactCountryFlag from 'react-country-flag';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { useTheme, alpha } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';
import {
  generateLoginToken, handleLoginTokenListeners, nativeEnvironment, nativePostMessage,
} from '../common/components/NativeInterface';
import { useCatch } from '../reactHelper';
import QrCodeDialog from '../common/components/QrCodeDialog';
import fetchOrThrow from '../common/util/fetchOrThrow';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  '& .MuiInputLabel-outlined': {
    color: theme.palette.text.secondary,
  },
  '& .MuiInputLabel-outlined.Mui-focused': {
    color: theme.palette.primary.main,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  fontWeight: 600,
  letterSpacing: '0.5px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

const useStyles = makeStyles()((theme) => ({
  options: {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    zIndex: theme.zIndex.tooltip,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    width: '100%',
  },
  formField: {
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
  extraContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(3),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    width: '100%',
  },
  rememberMe: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiTypography-root': {
      fontSize: '0.875rem',
      color: theme.palette.text.secondary,
    },
  },
  loginButton: {
    padding: theme.spacing(1.5),
    minWidth: '120px',
  },
  socialLogin: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    width: '100%',
    marginTop: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(3, 0),
    '&::before, &::after': {
      borderColor: theme.palette.divider,
    },
  },
  dividerText: {
    padding: theme.spacing(0, 2),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: theme.spacing(-1),
    '& a': {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      fontSize: '0.875rem',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
  link: {
    cursor: 'pointer',
  },
}));

const LoginPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLocalLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], country: values[1].country, name: values[1].name }));

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showServerTooltip, setShowServerTooltip] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const languageEnabled = useSelector((state) => {
    const attributes = state.session.server.attributes;
    return !attributes.language && !attributes['ui.disableLoginLanguage'];
  });
  const changeEnabled = useSelector((state) => !state.session.server.attributes.disableChange);
  const emailEnabled = useSelector((state) => state.session.server.emailEnabled);
  const openIdEnabled = useSelector((state) => state.session.server.openIdEnabled);
  const openIdForced = useSelector((state) => state.session.server.openIdEnabled && state.session.server.openIdForce);
  const [codeEnabled, setCodeEnabled] = useState(false);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector((state) => state.session.server.announcement);

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setFailed(false);
    try {
      const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(code.length ? `${query}&code=${code}` : query),
      });
      if (response.ok) {
        const user = await response.json();
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        const target = window.sessionStorage.getItem('postLogin') || '/';
        window.sessionStorage.removeItem('postLogin');
        navigate(target, { replace: true });
      } else if (response.status === 401 && response.headers.get('WWW-Authenticate') === 'TOTP') {
        setCodeEnabled(true);
      } else {
        throw Error(await response.text());
      }
    } catch (error) {
      setError(t('loginFailed'));
      setLoading(false);
      // Add animation for error state
      const form = event.target;
      form.style.animation = 'shake 0.5s';
      setTimeout(() => {
        form.style.animation = '';
      }, 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleOpenIdLogin = () => {
    document.location = '/api/session/openid/auth';
  };

  useEffect(() => nativePostMessage('authentication'), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem('hostname') !== window.location.hostname) {
      window.localStorage.setItem('hostname', window.location.hostname);
      setShowServerTooltip(true);
    }
  }, []);

  return (
    <LoginLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className={classes.container} onKeyDown={handleKeyDown}>
          <Typography variant="h5" component="h1" gutterBottom align="center" color="textPrimary">
            {t('loginTitle')}
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" paragraph>
            {t('loginSubtitle')}
          </Typography>

          <StyledTextField
            label={t('userEmail')}
            name="email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
            required
            error={!!error}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box color="text.secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8L12 13L4.4 8C4.15 7.85 4 7.57 4 7.28C4 6.63 4.7 6.23 5.26 6.53L12 10.75L18.74 6.53C19.3 6.23 20 6.63 20 7.28C20 7.57 19.85 7.85 19.6 8Z" fill="currentColor"/>
                    </svg>
                  </Box>
                </InputAdornment>
              ),
            }}
          />

          <StyledTextField
            label={t('userPassword')}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            fullWidth
            required
            error={!!error}
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box color="text.secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17C12.55 17 13.0208 16.8042 13.4125 16.4125C13.8042 16.0208 14 15.55 14 15C14 14.45 13.8042 13.9792 13.4125 13.5875C13.0208 13.1958 12.55 13 12 13C11.45 13 10.9792 13.1958 10.5875 13.5875C10.1958 13.9792 10 14.45 10 15C10 15.55 10.1958 16.0208 10.5875 16.4125C10.9792 16.8042 11.45 17 12 17ZM6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V10C4 9.45 4.19583 8.97917 4.5875 8.5875C4.97917 8.19583 5.45 8 6 8H7V6C7 4.61667 7.4875 3.4375 8.4625 2.4625C9.4375 1.4875 10.6167 1 12 1C13.3833 1 14.5625 1.4875 15.5375 2.4625C16.5125 3.4375 17 4.61667 17 6V8H18C18.55 8 19.0208 8.19583 19.4125 8.5875C19.8042 8.97917 20 9.45 20 10V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM12 12C11.45 12 10.9792 12.1958 10.5875 12.5875C10.1958 12.9792 10 13.45 10 14C10 14.55 10.1958 15.0208 10.5875 15.4125C10.9792 15.8042 11.45 16 12 16C12.55 16 13.0208 15.8042 13.4125 15.4125C13.8042 15.0208 14 14.55 14 14C14 13.45 13.8042 12.9792 13.4125 12.5875C13.0208 12.1958 12.55 12 12 12ZM9 8H15V6C15 5.16667 14.7083 4.45833 14.125 3.875C13.5417 3.29167 12.8333 3 12 3C11.1667 3 10.4583 3.29167 9.875 3.875C9.29167 4.45833 9 5.16667 9 6V8Z" fill="currentColor"/>
                    </svg>
                  </Box>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box className={classes.forgotPassword}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={() => navigate('/forgot-password')}
              className={classes.link}
            >
              {t('loginForgot')}
            </Link>
          </Box>

          {error && (
            <Fade in={!!error}>
              <Alert 
                severity="error" 
                onClose={() => setError('')}
                sx={{ mt: 1, mb: 2 }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            className={classes.loginButton}
            startIcon={<LoginIcon />}
            sx={{
              mt: 1,
              background: 'linear-gradient(45deg, #1a73e8 0%, #0d47a1 100%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0d47a1 0%, #1a73e8 100%)',
              },
            }}
          >
            {loading ? t('loginLoading') : t('loginLogin')}
          </StyledButton>

          <Divider className={classes.divider}>
            <Typography variant="body2" className={classes.dividerText}>
              {t('loginOr')}
            </Typography>
          </Divider>

          <Box className={classes.socialLogin}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.545 10.239V13.762H16.639C16.407 15.17 14.482 18 12.001 18C9.098 18 7 15.356 7 12C7 8.644 9.098 6 12.001 6C13.204 6 14.108 6.48 14.8 6.934L16.8 5C15.501 3.941 13.993 3 12.001 3C7.699 3 4.2 7.03 4.2 12C4.2 16.97 7.7 21 12.001 21C17.1 21 19.8 16.5 19.8 12.3C19.8 11.8 19.8 11.3 19.7 10.8H12.545Z" fill="#4285F4"/>
                </svg>
              }
              sx={{ mb: 1 }}
            >
              {t('loginGoogle')}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              startIcon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1.5C8.7 1.5 6.6 2.3 4.9 3.6C3.2 4.9 2 6.7 2 9.1V14.9C2 17.3 3.2 19.1 4.9 20.4C6.6 21.7 8.7 22.5 12 22.5C15.3 22.5 17.4 21.7 19.1 20.4C20.8 19.1 22 17.2 22 14.9V9.1C22 6.8 20.8 4.9 19.1 3.6C17.4 2.3 15.3 1.5 12 1.5ZM12 3.5C14.9 3.5 16.3 4.2 17.4 5C18.5 5.8 19 6.8 19 9.1V14.9C19 17.2 18.5 18.2 17.4 19C16.3 19.8 14.9 20.5 12 20.5C9.1 20.5 7.7 19.8 6.6 19C5.5 18.2 5 17.2 5 14.9V9.1C5 6.8 5.5 5.8 6.6 5C7.7 4.2 9.1 3.5 12 3.5ZM9 8.5V15.5H15V13.5H11V8.5H9Z" fill="#1877F2"/>
                </svg>
              }
            >
              {t('loginFacebook')}
            </Button>
          </Box>

          <Box className={classes.extraContainer}>
            <Typography variant="body2" color="textSecondary">
              {t('loginNoAccount')}{' '}
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/register')}
                sx={{
                  color: 'primary.main',
                  fontWeight: 500,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {t('loginRegister')}
              </Link>
            </Typography>
            {emailEnabled && (
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/reset-password')}
                sx={{
                  color: 'primary.main',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {t('loginReset')}
              </Link>
            )}
          </Box>
        </form>
      </motion.div>
      
      <QrCodeDialog open={showQr} onClose={() => setShowQr(false)} />
      <Snackbar
        open={!!announcement && !announcementShown}
        message={announcement}
        action={
          <IconButton size="small" color="inherit" onClick={() => setAnnouncementShown(true)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
      
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </LoginLayout>
  );
};

export default LoginPage;
