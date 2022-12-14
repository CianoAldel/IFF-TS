import fs from "fs";
const rootDIR = __dirname + "/../../public/storage/";
import _ from "lodash";

// type File = {
//   folder?: string; // 👈️ optional
//   filename?: string; // 👈️ optional
// };

const useStorage = {
  destroy: async (folder: string, filename: string) => {
    //parameter media
    if (fs.existsSync(rootDIR + `${folder}/${filename}`)) {
      fs.unlinkSync(rootDIR + `${folder}/${filename}`);
    }
  },
  destroyFolder: async (uid: string) => {
    fs.access(rootDIR + `${uid}`, (err) => {
      if (!err) {
        fs.rmdirSync(rootDIR + `${uid}`, { recursive: true });
      }
    });
  },
  removeAll: async (folder: any, filenames: any) => {
    _.map(filenames, (file) => {
      useStorage.destroy(folder, file);
    });
  },
};

export default useStorage;
