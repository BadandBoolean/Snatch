import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { HomeModeContext } from "../../../lib/context";
import LoginBox from "../../components/ForBusinessHomePage/LoginBox";

export default function Business({ userDetails, salonDetails }) {
  const { homeMode, setHomeMode } = useContext(HomeModeContext);
  const router = useRouter();

  useEffect(() => {
    // redirect to the business home page if business is toggled.
    if (homeMode === "clients") {
      router.push("/");
    }
  }, [homeMode]);

  return (
    <>
      <LoginBox />
    </>
  );
}
