// WORK IN PROGRESS WORK IN PROGRESS WORK IN PROGRESS

import React from "react";
import { Upload, Button } from "antd/lib";
import { UploadOutlined } from "@ant-design/icons";
import { createClient } from "@supabase/supabase-js";
import styles from "../../styles/ppp.module.css";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// a preview of the provider profile which they can then edit!
// also allow them to upload a photo to the supabase storage bucket
// and display it here

export default function ProviderProfilePreview({ provider }) {
  //   const props = {
  //     action: async (file) => {
  //       const { data, error } = await supabase.storage
  //         .from("providerassets")
  //         .upload(`provider-${provider.id}`, file);
  //       if (error) {
  //         console.error(error);
  //       } else {
  //         console.log(data);
  //       }
  //     },
  //     onChange({ file, fileList }) {
  //       if (file.status !== "uploading") {
  //         console.log(file, fileList);
  //       }
  //       if (file.status === "done") {
  //         console.log(`${file.name} file uploaded successfully.`);
  //       } else if (file.status === "error") {
  //         console.error(`${file.name} file upload failed.`);
  //       }
  //     },
  //   };

  return (
    <div>
      {/* <Upload {...props}>
        <Button icon={<UploadOutlined />}>
          Click to Upload Provider Photo
        </Button>
      </Upload> */}

      <p className={styles.providerinfotext}>{provider.address}</p>
      <p className={styles.providerinfotext}>{provider.email}</p>
      <p className={styles.providerinfotext}>{provider.phone}</p>
    </div>
  );
}
