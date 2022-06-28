import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import React, { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import * as web3 from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from "@project-serum/anchor";
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { TOKEN_PROGRAM_ID, createTransferInstruction } from "@solana/spl-token";

import { getOrCreateAssociatedTokenAccount } from './getOrCreateAssociatedTokenAccount'


export default function FormPropsTextFields() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const { PublicKey, Connection, SystemProgram, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY } = anchor.web3;
    const to_pubkey = new PublicKey('BdyZxxTPJZJUPs6JcGZAE2u9QMWNJZ2V9AT7bAQhZizC');
    const [age, setAge] = React.useState('');
    const [age2, setAge2] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

    const [amount1, setAmount1] = React.useState(0);
    const [amount2, setAmount2] = React.useState(0);

    const [tokenlist, setTokenlist] = React.useState([]);
    const [keylist, setKeylist] = React.useState([]);
    const [rate, setRate] = React.useState(1);

    const handleChange = (event) => {
        for (let j = 0; j < keylist.length; j++) {
            const element = keylist[j];
            if (element.address1 === event.target.value) {
                setAge(event.target.value);
                setAge2(element.address2)
            }
        }
    };

    const handleChange2 = (event) => {
        for (let j = 0; j < keylist.length; j++) {
            const element = keylist[j];
            if (element.address1 === age && element.address2 === event.target.value) {
                setAge2(event.target.value);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClose2 = () => {
        setOpen2(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleOpen2 = () => {
        setOpen2(true);
    };

    const [balance1, setBalance1] = useState(0);

    useEffect(() => {
        if (wallet.connected === true) {
            getBalance();
            for (let t = 0; t < keylist.length; t++) {
                const element = keylist[t];
                if (age === element.address1) {
                    if (age2 === element.address2) {
                        setRate(element.rate);
                    }
                }
            }
        } else {
            setBalance1(0);
        }
    }, [age, age2])

    const getBalance = async () => {
        if (age === "So11111111111111111111111111111111111111112") {
            await connection.getBalance(wallet.publicKey)
                .then(result => {
                    setBalance1((result / 1e9).toFixed(4));
                })
        } else {
            let mint = new PublicKey(age);
            let mint2 = new PublicKey(wallet.publicKey);
            await connection.getTokenAccountsByOwner(mint2, { mint: mint })
                .then(result => {
                    connection.getTokenAccountBalance(result.value[0].pubkey)
                        .then(result => {
                            setBalance1(result.value.uiAmount.toFixed(4));
                        })
                }).catch(err => {
                    console.log(err, 77);
                })
        }
    }

    useEffect(() => {
        setAmount2(amount1 * rate);
    }, [amount1, rate])

    const getProvider = async () => {
        if ("solana" in window) {
            const provider = window.solana;
            if (provider.isPhantom) {
                console.log("Is Phantom installed?  ", provider.isPhantom);
                return provider;
            }
        } else {
            window.open("https://www.phantom.app/", "_blank");
        }
    };

    const splTosol = async () => {
        if (!to_pubkey || !amount1) return
        const toastId = toast.loading("Processing transaction...")

        try {
            if (!wallet.publicKey || !wallet.signTransaction) throw new WalletNotConnectedError()
            const toPublicKey = new PublicKey(to_pubkey)
            const mint = new PublicKey(age);
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                wallet.publicKey,
                mint,
                wallet.publicKey,
                wallet.signTransaction
            )
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                wallet.publicKey,
                mint,
                toPublicKey,
                wallet.signTransaction
            )
            const transaction = new web3.Transaction().add(
                createTransferInstruction(
                    fromTokenAccount.address, // source
                    toTokenAccount.address, // dest
                    wallet.publicKey,
                    amount1 * web3.LAMPORTS_PER_SOL,
                    [],
                    TOKEN_PROGRAM_ID
                )
            )
            const blockHash = await connection.getRecentBlockhash()
            transaction.feePayer = await wallet.publicKey
            transaction.recentBlockhash = await blockHash.blockhash
            const signed = await wallet.signTransaction(transaction)
            let signature = await connection.sendRawTransaction(signed.serialize())
            await axios.post(`${process.env.REACT_APP_BASE_URL}/trending/splTosol`, {
                signature: signature,
                amount: amount1,
                token: age
            })
                .then(res => {
                    if (res.data === 'success') {
                        toast.success('Swap Success!', {
                            id: toastId,
                        })
                        setBalance1((balance1 - amount1).toFixed(4));
                    } else if (res.data === 'repeat') {
                        toast.error('Signature is repeated');
                    } else {
                        toast.error('Error');
                    }
                })
                .catch(err => {
                    console.log(err, 'error');
                })
        } catch (error) {
            console.log(error)
            toast.error(`Transaction failed: ${error.message}`, {
                id: toastId,
            })
        }
    }

    const splTospl = async () => {
        if (!to_pubkey || !amount1) return
        const toastId = toast.loading("Processing transaction...")

        try {
            if (!wallet.publicKey || !wallet.signTransaction) throw new WalletNotConnectedError()
            const toPublicKey = new PublicKey(to_pubkey)
            const mint = new PublicKey(age);
            const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                wallet.publicKey,
                mint,
                wallet.publicKey,
                wallet.signTransaction
            )
            const toTokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                wallet.publicKey,
                mint,
                toPublicKey,
                wallet.signTransaction
            )
            const transaction = new web3.Transaction().add(
                createTransferInstruction(
                    fromTokenAccount.address, // source
                    toTokenAccount.address, // dest
                    wallet.publicKey,
                    amount1 * web3.LAMPORTS_PER_SOL,
                    [],
                    TOKEN_PROGRAM_ID
                )
            )
            const blockHash = await connection.getRecentBlockhash()
            transaction.feePayer = await wallet.publicKey
            transaction.recentBlockhash = await blockHash.blockhash
            const signed = await wallet.signTransaction(transaction)
            let signature = await connection.sendRawTransaction(signed.serialize())
            await axios.post(`${process.env.REACT_APP_BASE_URL}/trending/splTospl`, {
                signature: signature,
                amount: amount1,
                token: age,
                token2: age2
            })
                .then(res => {
                    if (res.data === 'success') {
                        toast.success('Swap Success!', {
                            id: toastId,
                        })
                        setBalance1((balance1 - amount1).toFixed(4));
                    } else if (res.data === 'repeat') {
                        toast.error('Signature is repeated');
                    } else {
                        toast.error('Error');
                    }
                })
                .catch(err => {
                    console.log(err, 'error');
                })
        } catch (error) {
            console.log(error)
            toast.error(`Transaction failed: ${error.message}`, {
                id: toastId,
            })
        }
    }

    const solToSpl = async () => {
        const toastId = toast.loading("Processing transaction...")
        // Detecing and storing the phantom wallet of the user (creator in this case)
        var provider = await getProvider();
        console.log("Public key of the emitter: ", provider.publicKey.toString());

        var transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: to_pubkey,
                lamports: amount1 * web3.LAMPORTS_PER_SOL //Investing 1 SOL. Remember 1 Lamport = 10^-9 SOL.
            }),
        );

        // Setting the variables for the transaction
        transaction.feePayer = await provider.publicKey;
        let blockhashObj = await connection.getRecentBlockhash();
        transaction.recentBlockhash = await blockhashObj.blockhash;

        // Transaction constructor initialized successfully
        if (transaction) {
            console.log("Txn created successfully");
        }

        // Request creator to sign the transaction (allow the transaction)
        let signed = await provider.signTransaction(transaction);
        // The signature is generated
        let signature = await connection.sendRawTransaction(signed.serialize());
        // Confirm whether the transaction went through or not

        connection.confirmTransaction(signature);

        //Signature chhap diya idhar
        await axios.post(`${process.env.REACT_APP_BASE_URL}/trending/solTotoken`, {
            signature: signature,
            amount: amount1,
            token: age2
        })
            .then(res => {
                if (res.data === 'success') {
                    setBalance1((balance1 - amount1).toFixed(4));
                    toast.success('Swap Success!', {
                        id: toastId,
                    })
                } else if (res.data === 'repeat') {
                    toast.error('Signature is repeated');
                } else {
                    toast.error('Error');
                }
            })
            .catch(err => {
                console.log(err, 'error');
            })
    }

    const Swap = () => {

        if (wallet.connected === true) {
            if (age === 'So11111111111111111111111111111111111111112') {
                try {
                    connection.getBalance(wallet.publicKey)
                        .then(function (value) {
                            if (amount1 * 1e9 < value) {
                                solToSpl();
                            } else {
                                toast.error('Value not fresh')
                            }
                        })
                } catch (err) {
                    console.log(err)
                }
            } else {
                try {
                    let mint = new PublicKey(age);
                    let mint2 = new PublicKey(wallet.publicKey);
                    connection.getTokenAccountsByOwner(mint2, { mint: mint })
                        .then(result => {
                            connection.getTokenAccountBalance(result.value[0].pubkey)
                                .then(result => {
                                    if (result.value.uiAmount < amount1) {
                                        toast.error('Price is not enough');
                                    } else {
                                        if (age2 === "So11111111111111111111111111111111111111112") {
                                            splTosol();
                                        } else {
                                            splTospl();
                                        }
                                    }
                                })
                        }).catch(err => {
                            console.log(err, 77);
                        })
                } catch (err) {
                    console.log(err)
                }
            }
        } else {
            toast.error('Wallet Not Connected!');
        }
    }

    const tokenChange = () => {
        const keypairs = keylist.find((k) => k.address1 === age2 && k.address2 === age);
        if (keypairs) {
            setAge(age2);
            setAge2(age);
        }
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/trending/getTokenData`)
            .then(async (result) => {
                if (result) {
                    setAge(result.data[0][0].address1);
                    setAge2(result.data[0][0].address2);
                    setRate(result.data[0][0].rate);
                    setKeylist(result.data[0]);
                    setTokenlist(result.data[1]);
                    if (wallet.connected === true) {
                        if (result.data[0][0].address1 === "So11111111111111111111111111111111111111112") {
                            await connection.getBalance(wallet.publicKey)
                                .then(result => {
                                    setBalance1((Number(result) / 1e9).toFixed(4));
                                })
                        } else {
                            let mint = new PublicKey(result.data[0][0].address1);
                            let mint2 = new PublicKey(wallet.publicKey);
                            await connection.getTokenAccountsByOwner(mint2, { mint: mint })
                                .then(result => {
                                    connection.getTokenAccountBalance(result.value[0].pubkey)
                                        .then(result => {
                                            setBalance1(result.value.uiAmount.toFixed(4));
                                        })
                                }).catch(err => {
                                    console.log(err, 77);
                                })
                        }
                    }
                }
            })
            .catch(err => {
                console.log(err, 'error');
            })
    }, [wallet])

    return (
        <Box sx={{ display: 'grid', height: 'calc(100vh - 64px)', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1, p: '0px 100px !important' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span style={{ fontSize: '18px', color: '#ACAAAA', flex: '1', textAlign: 'right' }}>Token Balance:<span style={{ color: '#4BD5F3' }}>{balance1}</span></span>
                        <div className='tokenlist' style={{ position: 'relative', width: '50%', display: 'flex', border: '1px solid #b90ee2', borderRadius: '5px' }}>
                            <TextField id="outlined-basic" type='Number' className='textField' style={{ width: '100%' }} variant="outlined" value={amount1} onChange={(event) => {
                                setAmount1(event.target.value)
                            }} />
                            <FormControl className='mw_50' sx={{ minWidth: 250 }}>
                                <Select
                                    className='tokenSelect'
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    open={open}
                                    onClose={handleClose}
                                    onOpen={handleOpen}
                                    value={age}
                                    label="Age"
                                    onChange={handleChange}
                                >
                                    {
                                        tokenlist.map((token) => {
                                            const keypairs = keylist.find((k) => k.address1 === token.address);
                                            if (keypairs) {
                                                return (<MenuItem value={token.address} key={token.address}>
                                                    <div className='tokenlist_mlist' style={{ display: 'none' }}>
                                                        <img alt='img' src={`./tokenLogo/${token.logo}`} style={{
                                                            width: '20px', height: '20px', marginRight: '5px', borderRadius: '15px'
                                                        }} />
                                                    </div>
                                                    <div className='tokenlist_list' style={{ display: 'flex', alignItems: 'center', width: '160px' }}>
                                                        <img alt='img' src={`./tokenLogo/${token.logo}`} style={{
                                                            width: '20px', height: '20px', marginRight: '5px', borderRadius: '15px'
                                                        }} />
                                                        {token.name}({token.symbol})
                                                    </div>
                                                </MenuItem>)
                                            }
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                        <Grid item xs={12} sx={{ textAlign: 'center', margin: '10px 0px' }}>
                            <Button variant='contained' onClick={tokenChange} style={{ borderRadius: '50%', width: '100%', height: '60px', fontSize: '24px', background: 'transparent', border: '1px solid #b90ee2', fontFamily: 'Pancake' }}><SwapVertIcon style={{ color: '#b90ee2' }} /></Button>
                        </Grid>
                        <div className='tokenlist' style={{ position: 'relative', width: '50%', display: 'flex', border: '1px solid #b90ee2', borderRadius: '5px' }}>
                            <TextField id="outlined-basic" className='textField' style={{ width: '100%' }} variant="outlined" value={amount2} readOnly />
                            <FormControl className='mw_50' sx={{ minWidth: 250 }}>
                                <Select
                                    className='tokenSelect'
                                    labelId="demo-controlled-open-select-label"
                                    id="demo-controlled-open-select"
                                    open={open2}
                                    onClose={handleClose2}
                                    onOpen={handleOpen2}
                                    value={age2}
                                    label="Age"
                                    onChange={handleChange2}
                                >
                                    {
                                        tokenlist.map((token) => {
                                            const keypairs = keylist.find((k) => k.address1 === age && k.address2 === token.address);
                                            if (keypairs) {
                                                return (
                                                    <MenuItem value={token.address} key={token.address + 1}>
                                                        <div className='tokenlist_mlist' style={{ display: 'none' }}>
                                                            <img alt='img' src={`./tokenLogo/${token.logo}`} style={{
                                                                width: '20px', height: '20px', marginRight: '5px', borderRadius: '15px'
                                                            }} />
                                                        </div>
                                                        <div className='tokenlist_list' style={{ display: 'flex', alignItems: 'center', width: '160px' }}>
                                                            <img alt='img' src={`./tokenLogo/${token.logo}`} style={{
                                                                width: '20px', height: '20px', marginRight: '5px', borderRadius: '15px'
                                                            }} />
                                                            {token.name}({token.symbol})
                                                        </div>
                                                    </MenuItem>
                                                )
                                            }
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Button variant='contained' onClick={Swap} style={{ width: '50%', fontSize: '24px', background: 'transparent', border: '1px solid #b90ee2', fontFamily: 'Pancake', color: '#b90ee2' }}>Swap</Button>
                    </Grid>
                    <Toaster />
                </Grid>
            </Box>
        </Box>
    );
}