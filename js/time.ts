export const convertDurationtoMs = (duration: String) =>{
    if (duration.split(':').length == 2) {
      duration = '00:' + duration;
    }
    const [hours, minutes, seconds] = duration.split(':');
   
    return (
      (Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds))
    );
  }
export const convertMstoTime = (seconds:number) => {
  var sec_num = parseInt(seconds+"", 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    if(hours > 0){
      return hours + ' hr ' + (minutes > 0 ? minutes+" min":"");
    }else{
      return (minutes > 0 ? minutes+" min":"");
    }
}
export const convertMstoDuration = (seconds:number) => {
  var sec_num = parseInt(seconds+"", 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    let hoursText =  hours+"";
    let minutesText = minutes+"";
    let secondsText = seconds+"";
    if (hours   < 10) {hoursText   = "0"+hours;}
    if (minutes < 10 && hours > 0) {minutesText = "0"+minutes;}
    if (seconds < 10) {secondsText = "0"+seconds;}
    if(hours > 0){
      return hoursText + ':' + minutesText + ':' + secondsText;
    }else{
      return minutesText + ':' + secondsText;
    }
}
