// const fs = require("fs");

// const input = fs.readFileSync("input.txt", "utf8");

// const cs =
//   "TLS_AES_256_GCM_SHA384:" +
//   "TLS_CHACHA20_POLY1305_SHA256:" +
//   "TLS_AES_128_GCM_SHA256:" +
//   "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:" +
//   "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:" +
//   "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:" +
//   "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:" +
//   "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:" +
//   "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:" +
//   "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:" +
//   "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:" +
//   "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:" +
//   "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256";

// const fm = encodeURIComponent(
//   JSON.stringify({
//     tcp: [
//       {
//         type: "fragment",
//         settings: {
//           packets: "tlshello",
//           lengths: ["0", "104", "1"],
//           delays: ["0"],
//           maxSplit: "0",
//         },
//       },
//       {
//         type: "fragment",
//         settings: {
//           packets: "1-1",
//           lengths: ["114", "1"],
//           delays: ["1"],
//           maxSplit: "11",
//         },
//       },
//     ],
//   })
// );

// const configs = input
//   .split(/\r?\n/)
//   .map((x) => x.trim())
//   .filter(Boolean);

// const output = configs.map((config) => {
//   const url = new URL(config);

//   const uuid = url.username;
//   const host = url.searchParams.get("host");
//   const path = url.searchParams.get("path");
//   const label = url.hash;

//   const params = new URLSearchParams();

//   params.set("encryption", "none");
//   params.set("security", "tls");
//   params.set("sni", host);
//   params.set("fp", "unsafe");
//   params.set("alpn", "http/1.1");
//   params.set("cs", cs);
//   params.set("fm", decodeURIComponent(fm));
//   params.set("type", "ws");
//   params.set("host", host);
//   params.set("path", path);

//   return (
//     `vless://${uuid}@188.114.97.6:443?` +
//     params.toString() +
//     label
//   );
// });

// fs.writeFileSync("output.txt", output.join("\n"));

// console.log(`Converted ${output.length} configs.`);

const fs = require("fs");

const input = fs.readFileSync("input.txt", "utf8");

const cs =
    "TLS_AES_256_GCM_SHA384:" +
    "TLS_CHACHA20_POLY1305_SHA256:" +
    "TLS_AES_128_GCM_SHA256:" +
    "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:" +
    "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:" +
    "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:" +
    "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:" +
    "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:" +
    "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:" +
    "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:" +
    "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:" +
    "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:" +
    "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256";

const fm = JSON.stringify({
    tcp: [
        {
            type: "fragment",
            settings: {
                packets: "tlshello",
                lengths: ["0", "104", "1"],
                delays: ["0"],
                maxSplit: "0",
            },
        },
        {
            type: "fragment",
            settings: {
                packets: "1-1",
                lengths: ["114", "1"],
                delays: ["1"],
                maxSplit: "11",
            },
        },
    ],
});

const configs = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const converted = configs.map((config, index) => {
    const url = new URL(config);

    const uuid = url.username;
    console.log(uuid)

    // PRESERVE original address and port
    const address = url.hostname;
    const port = url.port;

    //   const uuid = decodeURIComponent(url.username);

    const params = new URLSearchParams(url.search);

    const host = params.get("host") || url.hostname;

    // Normalize parameters
    params.set("encryption", "none");
    params.set("security", "tls");
    params.set("sni", host);
    params.set("fp", "unsafe");
    params.set("alpn", "http/1.1");
    params.set("cs", cs);
    params.set("fm", fm);
    params.set("type", "ws");
    params.set("host", host);

    // Keep original path exactly
    if (url.searchParams.has("path")) {
        params.set("path", url.searchParams.get("path"));
    }

    const label = `#Converted ${index + 1}`;

    return (
        `vless://${uuid}@${address}:${port}?` +
        params.toString() +
        label
    );
});

fs.writeFileSync("output.txt", converted.join("\n"));