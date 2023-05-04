import React from 'react';
import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
  useNFT,
  useOwnedNFTs,
} from '@thirdweb-dev/react';
import styles from '../styles/Home.module.css';
import { editionDropAddress, editionDropTokenId } from '../const/yourDetails';

const Home: React.FC = () => {
  const address = useAddress();

  // Get the edition drop contract
  const { contract: editionDropContract } = useContract(editionDropAddress);
  
  // Get the NFT data for the specified token ID
  const { data: nft, isLoading: isNftLoading } = useNFT(
    editionDropContract,
    editionDropTokenId,
  );
  
  // Get the user's owned NFTs
  const { data: ownedNfts, refetch: refetchOwnedNfts } = useOwnedNFTs(
    editionDropContract,
    address,
  );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://thirdweb.com/">thirdweb</a>!
        </h1>

        <p className={styles.description}>
          Claim your test access pass by creating an account!
        </p>

        {/* Render the ConnectWallet component */}
        <div className={styles.connect}>
          <ConnectWallet
            dropdownPosition={{
              align: 'center',
              side: 'bottom',
            }}
            btnTitle="Login"
          />
        </div>

        {/* Display the NFT image and claim button */}
        {isNftLoading ? (
          'Loading...'
        ) : (
          <div className={styles.card}>
            <img
              className={styles.nftImage}
              src={nft?.metadata?.image ?? ''}
              alt={nft?.metadata?.description ?? ''}
            />
            {address ? (
              <>
                <p>You own {ownedNfts?.[0]?.quantityOwned || '0'}</p>
                <Web3Button
                  contractAddress={editionDropAddress}
                  action={(contract) =>
                    contract.erc1155.claim(editionDropTokenId, 1)
                  }
                  onSuccess={async () => {
                    await refetchOwnedNfts();
                    alert('Claim successful!');
                  }}
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  Claim!
                </Web3Button>
              </>
            ) : (
              <p>Login to claim!</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
