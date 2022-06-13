var router = require('express').Router()
const useLocalStorage = require('../modules/useLocalStorage')
const usePlayer = require('../modules/usePlayer')
const useCollection = require('../modules/useCollection')
const useMetadata = require('../modules/useMetadata')
const useBigchaindb = require('../modules/useBigchaindb')

const { removeItem } = useLocalStorage()
const { getCollection, createCollection } = useCollection()
const { getMetadatas, createMetadata } = useMetadata()
const { player_login, player_register, getPlayer } = usePlayer()
const { fetchLatestTransaction } = useBigchaindb()
// api/products
router.post('/user_login', async (req, res) => {
    try {
        const props = req.body;

        var register_result
        const player = await getPlayer()
        if (!player) {
            register_result = await player_login({
                mnemonic: props.mnemonic
            })
        }
        // chcek in db if collection tkda
        if (register_result || player) {

            res.status(200).json(register_result || player)
        } else {
            res.status(200).json("SetupCollectionPage")
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;

