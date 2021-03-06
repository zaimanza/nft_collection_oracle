const bip39 = require('bip39')
const BigChainDB = require('bigchaindb-driver')
const { getItem } = require('../middleware/local_storage.middleware')
const { Assets, Transactions } = require('../database/mongodb.database')
const { fetchLatestTransaction, createSingleAsset } = require('../database/bigchaindb.database')

exports.getMetadatas = async () => {
    const assetsModel = await Assets()
    const transactionsModel = await Transactions()

    const localPlayetrData = await JSON.parse(
        await getItem({
            key: "player"
        })
    )

    const fetchedTransactions = await transactionsModel.find({
        "operation": "CREATE",
        "outputs.public_keys": localPlayetrData.publicKey
    }, { projection: { id: 1, _id: 0 } }).toArray()

    var ownerAssets = []
    for (const transaction of fetchedTransactions) {
        const fetchedAssets = await assetsModel.findOne({
            "id": transaction.id,
            "data.type": "metadata",
        })

        if (fetchedAssets) {
            ownerAssets.push(fetchedAssets)
        }
    }

    if (ownerAssets.length != 0) {
        return ownerAssets
    }

    return []
}

exports.createMetadata = async ({ asset, metadata, publicKey, privateKey }) => {
    try {
        let isExists = false
        let latestTransaction

        // find player pnya transactions
        const transactionsModel = await Transactions()
        const assetsModel = await Assets()
        const fetchedTransactions = await transactionsModel.find({
            "operation": "CREATE",
            "inputs.owners_before": publicKey
        }, { projection: { id: 1, _id: 0 } }).toArray()

        // find with condition nama game and ................
        for (const transaction of fetchedTransactions) {

            const fetchedData = await assetsModel.find({
                "id": transaction.id,
                "data.type": "metadata",
            }).toArray()
            // if (fetchedData.length != 0) isExists = true

            latestTransaction = await fetchLatestTransaction(transaction.id)

        }
        // // IF TAK WUJUD baru ampa create
        if (isExists == false) {

            latestTransaction = await createSingleAsset({
                asset: asset,
                metadata: metadata,
                publicKey: publicKey,
                privateKey: privateKey,
            })
        }

        return latestTransaction ?? {}

    } catch (error) {
        return
    }

}