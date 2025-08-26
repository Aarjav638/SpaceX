import { LaunchesResponse, launchpadInfo } from '@/types/launcehs';
import axios, { AxiosError } from 'axios';
export const getLaunpads = async (
  page = 1,
  limit = 10
): Promise<LaunchesResponse> => {
  try {
    const query = {
      options: {
        limit: limit,
        page: page,
      },
    };
    const res = await axios.post(
      'https://api.spacexdata.com/v5/launches/query',
      query
    );
    const launches = res.data;
    return launches;
  } catch (error) {
    let message = 'something went wrong';
    if (error instanceof AxiosError && error.response?.data.message) {
      message = error.response?.data.message;
    } else if (error instanceof AxiosError) {
      message = error.message;
    }

    throw new Error(message);
  }
};
export const getLaunpadInfo = async (id: string): Promise<launchpadInfo> => {
  try {
    const res = await axios.get(
      `https://api.spacexdata.com/v4/launchpads/${id}`
    );
    const launchInfo = res.data;
    return launchInfo;
  } catch (error) {
    let message = 'something went wrong';
    if (error instanceof AxiosError && error.response?.data.message) {
      message = error.response?.data.message;
    } else if (error instanceof AxiosError) {
      message = error.message;
    }

    throw new Error(message);
  }
};

export const formatElapsedTime = (elapsedMs: number): string => {
  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  return `${days}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
};
