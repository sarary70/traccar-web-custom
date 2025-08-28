import { useMediaQuery, Paper, Box, Typography, useTheme as useMuiTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import LogoImage from './LogoImage';
import { motion } from 'framer-motion';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column-reverse',
    },
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)',
    padding: theme.spacing(4),
    width: '45%',
    position: 'relative',
    overflow: 'hidden',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      padding: theme.spacing(4, 2),
      paddingBottom: theme.spacing(8),
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29-22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      opacity: 0.3,
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: theme.spacing(6, 4),
    boxShadow: 'none',
    background: 'transparent',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(8),
    },
  },
  form: {
    maxWidth: '420px',
    width: '100%',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: theme.palette.primary.main,
    },
  },
  welcomeText: {
    color: theme.palette.common.white,
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    position: 'relative',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
}));

const LoginLayout = ({ children }) => {
  const { classes } = useStyles();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box className={classes.root}>
      {!isMobile && (
        <Box className={classes.sidebar}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LogoImage color="#ffffff" />
            <Typography variant="h4" className={classes.welcomeText}>
              مرحباً بك في نظام التتبع
            </Typography>
            <Typography variant="subtitle1" color="#e3f2fd" align="center">
              نظام إدارة وتتبع المركبات والموارد
            </Typography>
          </motion.div>
        </Box>
      )}
      <Paper component="main" className={classes.paper} elevation={0}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={classes.form}
        >
          <div className={classes.logoContainer}>
            <LogoImage color={theme.palette.primary.main} />
          </div>
          {children}
        </motion.div>
      </Paper>
    </Box>
  );
};

export default LoginLayout;
