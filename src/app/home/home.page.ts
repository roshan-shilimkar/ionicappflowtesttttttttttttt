import { Component } from '@angular/core';
import { Deploy } from 'cordova-plugin-ionic/dist/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Toast } from '@capacitor/toast';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  path: any;
  progress: any = 0;
  public current_status=""
  interval: any;

  constructor(
    private deploy: Deploy,
    private iab: InAppBrowser
  ) {}

  async itemSelected() {
    console.log("item selected clicked");
    const versions = await this.deploy.getAvailableVersions();
    console.log("Versions ", versions);
    // console.log('Selected Item', item);
    const app_path = this.seekChannels(versions, "development");
    console.log(app_path);
    this.path =
      'file:///data/user/11/com.hdfc.ionicApps/files/ionic_built_snapshots/' +
      app_path +
      '/index.html';

    //   this.path = 'file:///data/user/0/com.hdfc.ionicApps/files/ionic_built_snapshots/' + app_path + '/index.html';

    if (app_path == undefined) {
      var toast_message =
        "e29855fb" + ' ' + 'missing..' + ' ' + 'fetching from server ..';

      const showHelloToast = async () => {
        await Toast.show({
          text: toast_message,
        });
      };

      this.callUpdate_1();
    } else {
      const browser = this.iab.create(this.path, '_self', {
        clearcache: 'yes',
        clearsessioncache: 'yes',
      });
    }
  }

  seekChannels(versions: any, channel: any) {
    debugger;
    for (var i = 0, l = versions.length; i < l; i++) {
      if (typeof versions[i] == 'object' && versions[i].channel === channel) {
        return versions[i].versionId;
      }
    }
  }

  async callUpdate_1() {
    alert('inside call update');
    // let conntype = this.network.type;

    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
    };

    let conntype = JSON.parse(
      JSON.stringify(logCurrentNetworkStatus())
    ).connectionType;

    if (conntype && conntype !== 'unknown' && conntype !== 'none') {
      // if (this.syncflag == false) {
      console.log('insdie call update');

      // this.syncflag = true;
      // for (var i = 0; i < this.packList.length; i++) {
      // console.log(this.packList[i]);
      // this.force_close = false;
      this.progress = 0;
      // var channel_name= packList[i];
      // console.log(channel_name);
      await this.performManualUpdatecrm("development");
      // }
      // this.syncflag = false;
      // }
    } else {
      alert('Pls check the ineternet..and click on refresh icon');
    }
  }

  async performManualUpdatecrm(channel:any) {
    // let loading_1 = this.loadingCtrl.create({
    //   spinner: 'crescent',
    // });

    // let current_sync = true;
    // loading_1.present();

    const versions = await this.deploy.getAvailableVersions();
    console.log("version = ",versions);
    const config = {
      appId: '040d0d97',
      channel: channel,
    };

    await this.deploy.configure(config);

    var prevVersion = '';
    if (versions.length > 0) {
      prevVersion = await this.seekChannels(versions, channel);
      console.log("prevVersion = ",prevVersion);
    }

    try {
      // let alert = this.alertCtrl.create({
      //   title: '',
      //   subTitle:
      //     channel +
      //     ' ' +
      //     'Loading' +
      //     ' ' +
      //     '<img src="../assets/imgs/ajax-loader (1).gif">',
      //   buttons: [
      //     {
      //       text: 'Cancel',
      //       handler: () => {
      //         alert.dismiss();
      //       },
      //     },
      //   ],
      //   enableBackdropDismiss: false, // <- Here! :)
      // });

      let interval_1 = setTimeout(() => {
        // call your functions like

        // if (prevVersion != '' && prevVersion != undefined) {
        //   loading_1.dismiss();
        // }
      }, 4000);

      const update = await this.deploy.checkForUpdate();
      debugger;
      clearTimeout(interval_1);
      // loading_1.dismiss();

      console.log(prevVersion);
      if (update.available == true && update.snapshot != prevVersion) {
        console.log('Fired for update');

        this.interval = setTimeout(() => {
          // call your functions like
          if (
            // this.syncflag == true &&
            prevVersion != '' &&
            prevVersion != undefined
          ) {
            // const confirm = this.alertCtrl.create({
            //   title: 'Slow internet detected.....',
            //   message: 'Do you want to continue?',
            //   buttons: [
            //     {
            //       text: 'Cancel',
            //       handler: () => {
            //         this.force_close = true;
            //         alert.dismiss();
            //       },
            //     },
            //     {
            //       text: 'Continue',
            //       handler: () => {
            //         console.log('Agree clicked');
            //       },
            //     },
            //   ],
            // });
            // confirm.present();
          } else {
            alert('Slow internet connection detected...');
          }
          // alert('success');
        }, 150000);

        // alert.present();

        await this.deploy.downloadUpdate((progress) => {
          this.progress = progress;
          this.current_status = channel + ' ' + 'download status';

          console.log("downloadUpdate" ,progress);
        });

        await this.deploy.extractUpdate((progress) => {
          this.current_status = channel + ' ' + 'extract status';
          console.log("extractUpdate" ,progress);

          this.progress = progress;
        });

        console.log(prevVersion);
        if (prevVersion != '') {
          this.deploy.deleteVersionById(prevVersion);
        }

        // loading.dismiss();
        // alert.dismiss();
        //await this.deploy.reloadApp();
      }
      clearTimeout(this.interval);
    } catch (error) {
      // this.syncflag = false;
      // Code to handle exception
    }
  }
}
