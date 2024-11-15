/*
This software is Copyright ©️ 2024 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
import { checkModel, downloadModel, fetchOfflineLessonData } from "api";
import { useEffect, useState } from "react";
import { User, UserRole } from "types";

export interface DownloadStatus {
  isDownloading: boolean;
  isDownloadable: boolean;
  downloadMessage: string | undefined;
  download: () => void;
  dismissDownloadMessage: () => void;
}

export function useWithDownload(
  lessonId: string | null | undefined,
  user: User | undefined,
  accessToken: string | undefined
): DownloadStatus {
  const [isDownloadable, setIsDownloadable] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadMessage, setDownloadMessage] = useState<string>();

  useEffect(() => {
    if (!lessonId || user?.userRole !== UserRole.ADMIN) {
      return;
    }
    checkModel(lessonId).then((r) => {
      setIsDownloadable(r);
    });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function downloadJsonFile(fileName: string, data: any) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }

  async function download() {
    if (!lessonId || isDownloading || !isDownloadable || !accessToken) {
      return;
    }
    setIsDownloading(true);
    try {
      const lessonData = await fetchOfflineLessonData(lessonId, accessToken);
      const modelData = await downloadModel(lessonId);
      downloadJsonFile("data", lessonData);
      const w2vData = modelData["embedding"];
      downloadJsonFile("w2v", w2vData);
      delete modelData["embedding"];
      downloadJsonFile("model", modelData);
      setIsDownloading(false);
    } catch (err) {
      console.error(err);
      setDownloadMessage("Download failed!");
      setIsDownloading(false);
    }
  }

  function dismissDownloadMessage() {
    setDownloadMessage(undefined);
  }

  return {
    isDownloadable,
    isDownloading,
    downloadMessage,
    download,
    dismissDownloadMessage,
  };
}
