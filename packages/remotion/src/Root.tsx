import { Composition } from 'remotion';
import { StateOfAI } from './compositions/StateOfAI';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="StateOfAI"
        component={StateOfAI}
        durationInFrames={540}
        width={1920}
        height={1080}
        fps={30}
        defaultProps={{}}
      />
    </>
  );
};
