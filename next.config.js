/** @type {import('next').NextConfig} */
const { withAxiom } = require("next-axiom");

const nextConfig = {};

module.exports = withAxiom({
  reactStrictMode: true,
});
