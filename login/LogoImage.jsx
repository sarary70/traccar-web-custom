import { useTheme, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { makeStyles } from 'tss-react/mui';
import ArabicLogo from '../src/components/ArabicLogo';

const useStyles = makeStyles()((theme) => ({
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
    '& svg': {
      width: '100%',
      height: 'auto',
      maxWidth: '280px',
    },
  },
}));

const LogoImage = ({ color }) => {
  const theme = useTheme();
  const { classes } = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const logo = useSelector((state) => state.session.server.attributes?.logo);
  const logoInverted = useSelector((state) => state.session.server.attributes?.logoInverted);

  if (logo) {
    if (!isMobile && logoInverted) {
      return (
        <div className={classes.logoContainer}>
          <img src={logoInverted} alt="" style={{ maxHeight: isMobile ? '60px' : '80px', width: 'auto' }} />
        </div>
      );
    }
    return (
      <div className={classes.logoContainer}>
        <img src={logo} alt="" style={{ maxHeight: isMobile ? '60px' : '80px', width: 'auto' }} />
      </div>
    );
  }

  return (
    <div className={classes.logoContainer}>
      <ArabicLogo 
        color={color} 
        size={isMobile ? 'small' : 'medium'}
      />
    </div>
  );
};

export default LogoImage;
