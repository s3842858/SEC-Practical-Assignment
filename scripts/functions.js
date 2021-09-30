function hashPassword() {
    var input = document.getElementById('pw').value;
    if (input == "") {
        var hash = "";

    } else {
        var hash = SHA256.hash(input);
    }

    return hash;
}

function encryptUsnPass(publicKey) {
    generatePrivatePublicKey(); // Generate client side rsa keys
    sendPublicKey();
    let username = document.getElementById('username').value;
    let passwordHash = hashPassword();

    let timestamp = Math.floor(new Date().getTime() / 1000);

    let passwordPlaintext = passwordHash + "&&&&&" + timestamp;


    // encrypt the plaintext using the public key
    let usernameCiphertext = RSA_encryption(username, publicKey);
    let passwordCiphertext = RSA_encryption(passwordPlaintext, publicKey);

    document.getElementById("username").value = usernameCiphertext;
    document.getElementById("pw").value = passwordCiphertext;

}

function RSA_encryption(message, publicKey) {

    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    var encrypted = encrypt.encrypt(message);

    return encrypted;
}

function RSA_decryption(ciphertext, privateKey) {

    var decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    var decrypted = decrypt.decrypt(ciphertext);

    return decrypted;
}

function generatePrivatePublicKey() {
    var sKeySize = 1024;
    var keySize = parseInt(sKeySize);
    var crypt = new JSEncrypt({ default_key_size: keySize });

    crypt.getKey();
    sessionStorage.setItem("privateKey", crypt.getPrivateKey());
    sessionStorage.setItem("publicKey", crypt.getPublicKey());
}

function removePrivatePublicKey() {
    sessionStorage.removeItem("privateKey");
    sessionStorage.removeItem("publicKey");
}

function sendPublicKey() {
    publicKey = sessionStorage.getItem("publicKey");
    $.ajax({
        url: '../setClientPublicKey.php',
        type: 'POST',
        data: { publicKeyClient: publicKey },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Error: Ajax cannot send client public key to server");
        }
    });
}

function decryptData(htmlId, ciphertext, prefix) {
    privateKey = sessionStorage.getItem("privateKey");
    decrypted = RSA_decryption(ciphertext, privateKey);
    document.getElementById(htmlId).innerHTML = prefix + decrypted;
}

function encryptProductLink(htmlId, message, publicKey) {
    let encrypted = RSA_encryption(message, publicKey);
    document.getElementById(htmlId).href = "product/?product=" + encrypted;
}

function encryptProduct(message, publicKey) {
    let encrypted = RSA_encryption(message, publicKey);
    // document.getElementById(htmlId).innerHTML = encrypted;
    return encrypted;
}

function encryptSendQuantity(publicKey) {
    let quantity = document.getElementById('quantity').value;
    let timestamp = Math.floor(new Date().getTime() / 1000);
    let plaintext = quantity + "&&&&&" + timestamp;
    let ciphertext = RSA_encryption(plaintext, publicKey);
    document.getElementById("quantity").value = ciphertext;
}

function decryptImage(htmlId, ciphertext, prefix) {
    privateKey = sessionStorage.getItem("privateKey");
    decrypted = RSA_decryption(ciphertext, privateKey);
    document.getElementById(htmlId).src = prefix + decrypted;
}