var router = require('express').Router()
const useLocalStorage = require('../../modules/useLocalStorage')
const usePlayer = require('../../modules/usePlayer')

const { removeItem } = useLocalStorage()
const { player_login, player_register, getPlayer } = usePlayer()
// api/products
router.get('/', async (req, res) => {
    removeItem({
        key: "player",
    })

    res.render('LoginPage/LoginPage', {
        mnemonic: "salad shield toss purse scale weasel dilemma hill gold attitude name admit",
    })
})

module.exports = router;


