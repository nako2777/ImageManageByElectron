const config = require("./config");

const contextMenuOptions = (win, that) => {
  return [
    {
      label: "最新の情報に更新",
      click: () => {
        win.reload();
      },
    },
    {
      label: "削除",
      click: () => {
        if (that.selectedFiles.length == 0) {
          return;
        }
        fetch(
          `http://127.0.0.1:${config.port}/deleteFile?pathList=${that.pathList}&files=${that.selectedFiles}`
        ).then((res) => {
          // console.log(res);
          //削除成功後はselectedFilesを[]に回復する
          console.log(that)
          if(res.status == 200){
            that.win.webContents.send('reloadDir')
          }
          that.selectedFiles = [];
        });
      },
    },
  ];
};
module.exports = contextMenuOptions;
