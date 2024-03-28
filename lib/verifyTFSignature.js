const { createHmac } = await import("node:crypto");

const verifyTFSignature = function (receivedSignature, payload) {
  const hmac = createHmac("sha256", process.env.TYPEFORM_SECRET);
  hmac.update(payload);
  const hash = hmac.digest("base64");

  return receivedSignature === `sha256=${hash}`;
};

export default verifyTFSignature;
