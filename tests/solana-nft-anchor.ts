import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaNftAnchor } from "../target/types/solana_nft_anchor";

describe("solana-nft-anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.solanaNftAnchor as Program<SolanaNftAnchor>;

  it("Mints a NFT!", async () =>{
    console.log("Minting a NFT")
  })
});
