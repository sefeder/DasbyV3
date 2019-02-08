import { VirgilCrypto, VirgilCardCrypto } from 'virgil-crypto'
import { CardManager, VirgilCardVerifier, CachingJwtProvider, KeyStorage } from 'virgil-sdk';
import config from "../config.json";
import api from '../utils/api';

export default {
    initializeVirgil: (upi) => {
        console.log('front end: hitting initialize virgil')
        return new Promise((resolve, reject) => {
            const virgilCrypto = new VirgilCrypto();
            const virgilCardCrypto = new VirgilCardCrypto(virgilCrypto);
            const privateKeyStorage = new KeyStorage();
            const cardManager = new CardManager({
                cardCrypto: virgilCardCrypto,
                cardVerifier: new VirgilCardVerifier(virgilCardCrypto)
            });
            const keyPair = virgilCrypto.generateKeys();

            
            // Get the raw private key bytes
            // Virgil Crypto exports the raw key bytes in DER format
            const privateKeyBytes = virgilCrypto.exportPrivateKey(keyPair.privateKey, upi).toString('base64');

            fetch(`${config.apiUrl}/database/users/update`,
            {
                method: 'POST',
                body: JSON.stringify({
                    privateKey: privateKeyBytes,
                    upi: upi
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json())
            .then( updatedUser => {
                console.log('privateKey stored in db')
                resolve(updatedUser)
            })
            .catch(err=>console.log(err))
        
            const rawCard = cardManager.generateRawCard({
                privateKey: keyPair.privateKey,
                publicKey: keyPair.publicKey,
                identity: upi
            });
            fetch(`${config.apiUrl}/services/signup`, {
                method: 'POST',
                body: JSON.stringify({ rawCard }),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(response => response.json())
                .then(result => {
                    const publishedCard = cardManager.importCardFromJson(result.virgil_card);
                    // resolve(publishedCard)
                }).catch(err => console.log(err));
        }).catch(err => console.log(err))
    },
    getPrivateKey: (userUpi) => {
        return new Promise((resolve, reject) => {
            const virgilCrypto = new VirgilCrypto();
            api.getUser(userUpi)
                .then(dbUser =>{
                    const privateKeyBytes = JSON.parse(dbUser.user.private_key).toString('base64');
                    const privateKey = virgilCrypto.importPrivateKey(privateKeyBytes,userUpi);
                    resolve(privateKey);
                }).catch(err=>console.log(err))

        }).catch(err=>console.log(err))
    }
}