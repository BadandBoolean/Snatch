import React from "react";
import prisma from "../../../lib/prisma";
import { useSession, getSession } from "next-auth/react";
import { Spin } from "antd/lib";
import ohstyles from "../../styles/OwnerHome.module.css";
import styles from "../../styles/places.module.css";
import contactstyles from "../../styles/ContactForm.module.css";
// todo: resolve the URL to hyphenated salon names to hide the ID
export default function Place({ placeData, providers }) {
  const { data: session, status } = useSession();

  if (session === undefined) {
    return (
      <div className={ohstyles.loadingDivWrapper}>
        <Spin size="large" />
      </div>
    );
  }

  const getProviderNames = providers.map((provider) => {
    return (
      <div key={provider.id} className={ohstyles.InfoTextStyleProviders}>
        {provider.name}
      </div>
    );
  });

  return (
    <div className={ohstyles.colourWrapperPlaces}>
      <div className={ohstyles.InfoTextBox}>
        <div className={ohstyles.InfoTextStyleSalonNameBig}>
          {placeData.salonname}
        </div>
      </div>
      <div className={ohstyles.centerProviders}>
        <div className={contactstyles.contactOuterDivoh}>
          <div className={contactstyles.contactMiddleDivoh}>
            <div className={contactstyles.contactDivoh}>
              <div className={ohstyles.InfoTextBoxPlaces}>
                <div className={ohstyles.InfoTextStylePlaces}>Stylists</div>
                {getProviderNames}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const { params } = context;
  const { slug } = params;

  // the slug is the ID of the realsalon
  // get the realsalon info from the database
  let realsalon = null;

  try {
    realsalon = await prisma.RealSalon.findUnique({
      where: {
        id: slug,
      },
    });
  } catch (err) {
    console.error(err);
  }

  // get the stylists for the realsalon
  let providers = null;
  try {
    providers = await prisma.salon.findMany({
      where: {
        realSalonId: realsalon.id,
      },
    });
  } catch (err) {
    console.error(err);
  }

  return {
    props: {
      placeData: realsalon || null,
      providers: providers || null,
    },
  };
}
