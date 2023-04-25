import { Options } from 'ipfs-core';

const ipfsConfig: Options = {

  // repo: './ipfs', // Path to the IPFS repo, where the data is stored, diffrent repo means diffrent node hence diffrent data
  repo: './orbitdb/dbcenter/ipfs',
  start: true,
  offline: false,
  preload: {
    enabled: true
  },
  // relay: {
  //   enabled: true, //? enable circuit relay dialer and listener
  //   hop: {
  //     enabled: true, //? enable circuit relay HOP (make this node a relay)
  //     active: true
  //   }
  // },
  EXPERIMENTAL: {
    ipnsPubsub: true,
    sharding: true,
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
        // '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
        // '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
      ]
    }
  }
}

export default ipfsConfig;
