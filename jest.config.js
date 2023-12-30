module.exports = {
    preset: 'ts-jest',
    // ...
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.mjs$': 'babel-jest', // 添加这一行
      '^.+\\.js$': 'babel-jest', // 添加这一行
    },
    // ...
  };
  