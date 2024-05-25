const { defineConfig } = require("@vue/cli-service");
console.log(`MODE: ${process.env.NODE_ENV}`)
module.exports = defineConfig({
  transpileDependencies: true
});
