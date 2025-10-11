const MULTIPASS_CONTRACT_NAME = 'MultipassDNS';
const MULTIPASS_CONTRACT_VERSION = '0.0.1';
function getProcessEnv(print, key) {
  const ret = process.env[key];
  if (!ret) {
    throw new Error(key + ' must be exported in env');
  }
  return print ? 'X'.repeat(ret.length) : ret;
}

const func = async hre => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer, owner } = await getNamedAccounts();
  const deployment = await deploy('Multipass', {
    skipIfAlreadyDeployed: true,
    from: deployer,
    args: [true],
    proxy: {
      execute: {
        init: {
          methodName: 'initialize',
          args:
            process.env.NODE_ENV === 'TEST'
              ? [MULTIPASS_CONTRACT_NAME, MULTIPASS_CONTRACT_VERSION, owner]
              : [
                  getProcessEnv(false, 'MULTIPASS_CONTRACT_NAME'),
                  getProcessEnv(false, 'MULTIPASS_CONTRACT_VERSION'),
                  owner,
                ],
        },
      },
      proxyContract: 'OpenZeppelinTransparentProxy',
    },

    log: true,
    autoMine: true,
  });
  console.log('multipass deployed at ', deployment.address);
};

export default func;
func.tags = ['multipass'];
