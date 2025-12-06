use anchor_lang::prelude::*;

declare_id!("HZYm99HMPnFK43rNggnwRD3xeLaeTNKmApg6s3YSBijB");

#[program]
pub mod solana_nft_anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
