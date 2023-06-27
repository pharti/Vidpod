import axios from 'axios';
export const refreshToken = (user, client_name) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'https://yidpod.com/wp-json/api-bearer-auth/v1/tokens/refresh',
        {
          token: user.refresh_token,
          client_name,
        },
        { headers: { 'Content-Type': 'application/json;charset=UTF-8' } },
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch(async (error) => {
        await fetch(`https://yidpod.com/wp-json/yidpod/v1/updatetoken`, {
          method: 'POST',
          body: JSON.stringify({
            deviceId: client_name,
            user_id: user.wp_user.ID,
            token: user.refresh_token,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        });
      });
  });
};
