import ReactOnRails from 'react-on-rails';

import Lesson from '../components/Lesson/Lesson';
import RenderResultDev from '../components/Lesson/RenderResultDev';
import RenderPreloadLoading from '../components/Lesson/RenderPreloadLoading';
import RenderPreloadLoaded from '../components/Lesson/RenderPreloadLoaded';
import Upload from '../components/Upload/Upload';

ReactOnRails.register({
  Lesson,
  RenderResultDev,
  RenderPreloadLoading,
  RenderPreloadLoaded,
  Upload
});
