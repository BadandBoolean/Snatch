import React from "react";

export default function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /android|avantgo|bada\/|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos/i.test(
    userAgent
  );
}
