import TrackPlayer, { Capability } from 'react-native-track-player';

export const SetupService = async (): Promise<boolean> => {
  let isSetup = false;
  try {
    // this method will only reject if player has not been setup yet
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch {
    
    TrackPlayer.setupPlayer({
      minBuffer:5,
      maxBuffer:5,
      playBuffer:2
    }).then(async()=>{
      TrackPlayer.updateOptions({
        
        stoppingAppPausesPlayback: true,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SeekTo,
        ],
        progressUpdateEventInterval: 2,
      }).catch(error=>console.log(error));
    }).catch((err)=>{
      if (
        err?.message?.includes(
          'The player has already been initialized via setupPlayer',
        )
      ) {
        return Promise.resolve(true);
      }
      return Promise.reject(false);
    });
    

    isSetup = true;
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return isSetup;
  }
};
