import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { HomeModeContext } from "../../../lib/context";
import LoginBox from "../../components/ForBusinessHomePage/LoginBox";
import { getSession, useSession } from "next-auth/react";
import styles from "../../styles/BusinessHomePage.module.css";
import GoToOrMakeProviderProfile from "../../components/ForBusinessHomePage/GoToOrMakeProviderProfile";
import AddCalendar from "../../components/ForBusinessHomePage/AddCalendar";
import IconsGrid from "../../components/IconsGrid";
import UnderConstructionPageTemplate from "../../components/UnderConstructionPageTemplate";

export default function Business({ userDetails, providerDetails }) {
  const { data: session, status } = useSession(); // object, not array

  return (
    <div className={styles.pageWrapperGradient}>
      <div className={styles.pageRow}>
        <LoginBox />
        <GoToOrMakeProviderProfile
          session={session}
          status={status}
          userDetails={userDetails}
          providerDetails={providerDetails}
        />
      </div>
      <AddCalendar providerDetails={providerDetails} />
      <UnderConstructionPageTemplate />
    </div>
  );
}

export async function getServerSideProps(context) {
  let session = await getSession(context);
  console.log("session IN BUSINESS", session);
  let user = null;
  let provider = null;

  if (!!session) {
    // console.log(appointment);
    user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    provider = await prisma.salon.findUnique({
      where: {
        ownerId: user.id,
      },
    });
  }
  return {
    props: {
      userDetails: user || null,
      providerDetails: provider || null,
    },
  };
}
