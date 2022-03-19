module.exports = {
  apps: [
    {
      script: 'gameserver.js',
      cwd: 'backend/',
      name: 'Backend',
      watch: true
    },
    {
      script: 'gamefront.js',
      cwd: 'frontend/',
      name: 'Frontend',
      watch: true
    }
  ]
}
