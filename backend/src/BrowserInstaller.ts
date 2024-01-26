import fs from "node:fs";
import https from "https";
import os from "os";
import execFile from "child_process";
import exec from "child_process";
import * as path from "path";
import {Global} from "./Global";
export class BrowserInstaller {
    public static isInstalled() {
        let promise = new Promise((resolve) => {
            fs.exists( "./browser/", (result) => {
                resolve(result);
            });
        })
        return promise;
    }

    public static install() {
        let promise = new Promise((resolve, reject) => {
            fs.exists("./browserInstallTemp/", (result) => {
                if (result){
                    fs.rmdir("./browserInstallTemp/", downloadInstaller);
                }
                else {
                    downloadInstaller();
                }
            });

            fs.exists( "./browser/", (result) => {
                if (result){

                    fs.rmdir("./browser/", () => {});
                }
                else{

                    fs.mkdir("./browser/", () => {});
                }
            });

            const downloadInstaller = () => {
                fs.mkdir("./browserInstallTemp/", () => {
                    let fileName = "./browserInstallTemp/install.exe";

                    if (os.type() == "Linux"){
                        fileName = "./browserInstallTemp/install.tar.bz2";
                    }

                    let osString = "win";
                    switch (os.type()){
                        case "Windows_NT":
                            osString = "win";
                            break;
                        case "Linux":
                            osString = "linux";
                            break;
                        default:
                            throw new Error("Your os is not supported.");
                    }

                    let arch = "64";
                    switch (os.arch()){
                        case "x64":
                            arch = "64";
                            break;
                        case "x86":
                            arch = "32";
                            break;
                        case "arm64":
                            arch = "-aarch64";
                            // firefox does not support linux on arm
                            if (os.type() == "Linux"){
                                throw new Error("Your system architecture is not supported.")
                            }
                            break;
                        default:
                            throw new Error("Your system architecture is not supported.")
                    }

                    const file = fs.createWriteStream(fileName);
                    https.get("https://download.mozilla.org/?product=firefox-latest-ssl&os="+ osString + arch +"&lang=en-US", (response) => {
                        let body = "";
                        response.setEncoding("utf-8");
                        response.on('data', function (chunk){
                            body += chunk;
                        });
                        response.on('end', function() {
                            let split = body.split("href=\"");
                            let url = split[1].split("\"")[0];
                            //console.log(url);
                            https.get(url, (response) => {
                                response.pipe(file);

                                // after download completed close filestream
                                file.on("finish",  () => {
                                    file.close();
                                    Global.logger.log("Downloaded Browser installer/archive");
                                    Global.logger.log("Installing...")
                                    if (os.type() == "Windows_NT") {
                                        // wait until installer is not busy
                                        setTimeout(async () => {
                                            const process = execFile.execFile("./browserInstallTemp/install.exe", ["/ExtractDir=./browser"]);
                                            process.on("exit", () => {
                                                Global.logger.log("Browser Installed!");
                                                resolve("installed");
                                            })

                                        }, 1000);

                                    } else if (os.type() == "Linux") {
                                        // wait until zip is not busy
                                        setTimeout(async () => {
                                            const process = exec.exec("tar -xf ./browserInstallTemp/install.tar.bz2 -C ./browser/", (err, stdout, stderr) => {
                                                if (err){
                                                    throw new Error("Error when unzipping the firefox archive! Error: "+err);
                                                }
                                                Global.logger.log("Browser Installed!");
                                                resolve("installed");
                                            });
                                        }, 1000);
                                    }
                                });
                            });
                        });
                    });
                })
            }

        });
        return promise;
    }
}