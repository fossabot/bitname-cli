function randomBytes(size: number): Buffer {
    return Buffer.from('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f', 'hex');
}

module.exports = randomBytes;
