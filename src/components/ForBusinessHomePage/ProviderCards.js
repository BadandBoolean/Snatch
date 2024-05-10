import React, { useEffect } from "react";
import styles from "../../styles/ProviderCards.module.css";
import { Card, Spin } from "antd/lib";
const { Meta } = Card;
export default function ProviderCards({
  providersLoading,
  currVisibleProviders,
  serviceType,
}) {
  // on load, retrieve the real salon name of the provider, and add it to each provider object.
  // this will be used to display the salon name on the provider card
  useEffect(() => {
    // send a request to the backend to get the salon name of each provider
  }, [][(serviceType, currVisibleProviders)]);

  return (
    <div className={styles.providerCardsWrapper}>
      {providersLoading ? (
        <Spin />
      ) : (
        currVisibleProviders.map((provider) => (
          <div key={provider.id} className={styles.providerCardDiv}>
            <Card
              key={provider.id}
              title={provider.name}
              extra={provider.phone}
            >
              <p>{provider.address}</p>
            </Card>
          </div>
        ))
      )}
    </div>
  );
}
