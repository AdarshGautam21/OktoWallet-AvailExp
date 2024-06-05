const { cryptoWaitReady } = require('@polkadot/util-crypto');
const { Keyring } = require('@polkadot/keyring');

async function deriveWalletHierarchy(mnemonic, depthLimit = 3) {
    await cryptoWaitReady();
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });

    async function deriveAccounts(pair, path = '', depth = 0) {
        if (depth > depthLimit) return;

        const address = pair.address;
        const pathExplanation = explainDerivationPath(path);
        console.log(`Derivation Path: ${path} (${pathExplanation}), Address: ${address}, Depth: ${depth}`);

        const nextPath1 = `${path}//0`;
        const nextPath2 = `${path}//1`;
        const nextPair1 = pair.derive(nextPath1);
        const nextPair2 = pair.derive(nextPath2);

        await deriveAccounts(nextPair1, nextPath1, depth + 1);
        await deriveAccounts(nextPair2, nextPath2, depth + 1);
    }

    function explainDerivationPath(path) {
        const parts = path.split("//").slice(1); // Skip the initial empty part
        return parts.map((part, index) => {
            if (index === 0) return `Account #${parseInt(part) + 1}`;
            return `Address #${parseInt(part) + 1} of parent account`;
        }).join(", ");
    }

    const masterPair = keyring.addFromUri(mnemonic);
    await deriveAccounts(masterPair, '//m');
}

const mnemonic = "super join ocean safe novel favorite midnight foam gaze mean brush wave";
deriveWalletHierarchy(mnemonic);
