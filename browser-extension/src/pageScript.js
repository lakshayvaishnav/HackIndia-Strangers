import { Transaction, PublicKey, SystemProgram } from "@solana/web3.js";

import { Buffer } from "buffer";

window.Buffer = Buffer;

let blockhash = null;

console.log("only possible in solana.");

window.addEventListener("message", async (event) => {
  if (event.data.type === "SOLANA_BLOCKHASH_RESPONSE") {
    if (event.data.error) {
      console.error("Error fetching blockhash:", event.data.error);
    } else {
      blockhash = event.data.blockhash;
    }
  }

  if (event.data.type === "SOLANA_SIGN_REQUEST") {
    try {
      // checking if phantom wallet is installed
      const provider = window.solana;
      if (!provider) {
        throw new Error("please install phantom wallet");
      }
      const payerPublicKey = await connectWallet();

      // Transfer Token
      const signature = await transferToken();
    } catch (error) {}
  }
});

async function connectWallet() {
  if ("solana" in window) {
    const provider = window.solana;

    if (provider.isPhantom) {
      try {
        const response = await provider.connect();
        return response.publicKey.toString();
      } catch (error) {
        console.error("failed to connect wallet: ", error);
        return null;
      }
    }
  } else {
    console.error("phantom wallet is not installed");
    return null;
  }
}

function getBlockhash() {
  return new Promise(function (resolve, reject) {
    window.postMessage({ type: "SOLANA_BLOCKHASH_REQUEST" }, "*");

    const onMessage = (event) => {
      if (event.data.type === "SOLANA_BLOCKHASH_REQUEST") {
        if (event.data.error) {
          console.error(
            "failed to get the latest blockchash : ",
            event.data.error
          );
          reject(event.data.error);
        } else {
          blockhash = event.data.blockhash;
          console.log("recieved blockhash in pagescript : ", blockhash);
          resolve(blockhash);
        }
        window.removeEventListener("message", onMessage);
      }
    };
    window.addEventListener("message", onMessage);
  });
}

function sendRawTransaction(
  serialisedTransaction,
  payer,
  recipient,
  amount,
  tokenType
) {
  return new Promise((resolve, reject) => {
    window.postMessage({
      type: "SOLANA_SEND_RAW_TRANSACTION",
      serialisedTransaction,
      payer,
      recipient,
      amount,
      tokenType,
    });

    const onMessage = (event) => {
      if (event.data.type === "SOLANA_SEND_RAW_TRANSACTION_RESPONSE") {
        if (event.data.error) {
          console.error(
            "failed to get raw transaction response: ",
            event.data.error
          );
          reject(event.data.error);
        }
        window.removeEventListener("message", onMessage);
      }
    };
    window.addEventListener("message", onMessage);
  });
}

async function transferToken(payer, recipient, amount, tokenType) {
  const recipientPublicKey = new PublicKey(recipient);
  const payerPublicKey = new PublicKey(payer);

  let transaction = new Transaction();

  if (tokenType === "SOL") {
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payerPublicKey,
        toPubkey: recipientPublicKey,
        lamports: Number(amount) * 1e9,
      })
    );
  } else {
    throw new Error("token type not supported");
  }

  // set the recent blockhash and fee pyaer.

  const blockhash = await getBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payerPublicKey;

  // signining and send the transaction
  try {
    const provider = window.solana;
    const signedTransaction = await provider.signedTransaction(transaction);
    console.log("signed transaction : ", signedTransaction);

    const serialisedTransaction = await signedTransaction.serialize();

    const signature = await sendRawTransaction(
      serialisedTransaction,
      payer,
      recipient,
      amount,
      tokenType
    );
    console.log("Transaction successfull , signature : ", signature);
  } catch (error) {
    console.error("transaction failed : ", error);
    return null;
  }
}
