import Svg, { Path } from 'react-native-svg';
import React from 'react';

const CustomSvg = ({ variant, size }) => {
  if (variant === 'coins') {
    return (
      <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" style={{ width: size, height: size }}>
        <Path
          stroke="#323232"
          d="M5 0h6M2 1h3M11 1h3M1 2h1M14 2h1M1 3h1M14 3h1M1 4h1M14 4h1M0 5h1M15 5h1M0 6h1M4 6h1M12 6h1M15 6h1M0 7h1M15 7h1M0 8h1M6 8h1M9 8h1M15 8h1M0 9h1M6 9h4M15 9h1M0 10h1M15 10h1M1 11h1M14 11h1M1 12h1M14 12h1M1 13h1M14 13h1M2 14h3M11 14h3M5 15h6"
        />
        <Path
          stroke="#fff100"
          d="M5 1h6M4 2h2M10 2h4M3 3h2M11 3h3M2 4h2M13 4h1M2 5h1M13 5h2M14 6h1M14 7h1M1 8h1M14 8h1M1 9h1M14 9h1M1 10h2M13 10h2M2 11h2M13 11h1M2 12h2M12 12h2M2 13h4M10 13h4M5 14h6"
        />
        <Path stroke="#fffcff" d="M2 2h2M2 3h1M1 5h1M4 5h1M12 5h1M1 6h1M1 7h1" />
        <Path
          stroke="#feda00"
          d="M6 2h4M5 3h6M4 4h9M3 5h1M5 5h7M2 6h2M5 6h7M13 6h1M2 7h12M2 8h4M7 8h2M10 8h4M2 9h4M10 9h4M3 10h10M4 11h9M4 12h8M6 13h4"
        />
      </Svg>
    );
  }
  return null; // Return null for unsupported variants
};

export default CustomSvg;
