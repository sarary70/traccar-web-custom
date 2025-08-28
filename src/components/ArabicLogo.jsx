import React from 'react';
import { Box, Typography } from '@mui/material';

const ArabicLogo = ({ color = '#1a73e8', size = 'medium' }) => {
  const sizes = {
    small: { width: 120, height: 40, fontSize: '1.25rem' },
    medium: { width: 180, height: 60, fontSize: '1.75rem' },
    large: { width: 240, height: 80, fontSize: '2.5rem' },
  };

  const { width, height, fontSize } = sizes[size] || sizes.medium;

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center"
      sx={{ 
        width: '100%',
        maxWidth: width,
        height: 'auto',
        margin: '0 auto',
      }}
    >
      <Typography 
        variant="h4" 
        component="div"
        sx={{
          color: color,
          fontWeight: 700,
          fontSize: fontSize,
          lineHeight: 1.2,
          textAlign: 'center',
          fontFamily: 'Tajawal, Arial, sans-serif',
          direction: 'rtl',
        }}
      >
        نظام التتبع
      </Typography>
      <Box 
        sx={{
          width: '80%',
          height: '4px',
          background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
          marginTop: 1,
          borderRadius: '2px',
        }}
      />
    </Box>
  );
};

export default ArabicLogo;
