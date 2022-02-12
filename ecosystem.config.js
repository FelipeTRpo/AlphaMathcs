module.exports = {
  apps : [{
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
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
