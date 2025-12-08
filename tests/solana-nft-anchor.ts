import * as anchor from '@coral-xyz/anchor';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { SystemProgram, SYSVAR_RENT_PUBKEY, Keypair, PublicKey } from '@solana/web3.js';
import type { SolanaNftAnchor } from '../target/types/solana_nft_anchor';

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
describe('solana-nft-anchor', () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const payer = provider.wallet as anchor.Wallet;
    const program = anchor.workspace.SolanaNftAnchor as anchor.Program<SolanaNftAnchor>;

    // The metadata for our NFT
    const metadata = {
        name: 'Homer NFT',
        symbol: 'HOMR',
        uri: 'https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/nft.json',
    };

    it('Create an NFT!', async () => {
        // Generate a keypair to use as the address of our mint account
        const mintKeypair = new Keypair();

        // Derive Metadata PDA
        const [metadataPDA] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
            ],
            program.programId
        );

        // Derive Edition PDA
        const [editionPDA] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
                Buffer.from("edition"),
            ],
            program.programId
        );

        // Derive the associated token address account for the mint and payer.
        const associatedTokenAccountAddress = await getOrCreateAssociatedTokenAccount(
            provider.connection,
            payer.payer,
            mintKeypair.publicKey,
            payer.publicKey
        );

        const transactionSignature = await program.methods
            .mintNft(metadata.name, metadata.symbol, metadata.uri)
            .accounts({
                payer: payer.publicKey,
                metadataAccount: metadataPDA,
                editionAccount: editionPDA,
                mintAccount: mintKeypair.publicKey,
                associatedTokenAccount: associatedTokenAccountAddress.address,
                tokenProgram: TOKEN_PROGRAM_ID,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .signers([mintKeypair])
            .rpc();

        console.log('Success!');
        console.log(`   Mint Address: ${mintKeypair.publicKey}`);
        console.log(`   Transaction Signature: ${transactionSignature}`);
    });
});