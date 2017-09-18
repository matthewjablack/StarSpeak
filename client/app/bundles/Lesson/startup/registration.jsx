import ReactOnRails from 'react-on-rails';

import Lesson from '../components/Lesson/Lesson';
import RenderResultDev from '../components/Lesson/RenderResultDev';
import RenderRecordDev from '../components/Lesson/RenderRecordDev';
import RenderPreloadLoading from '../components/Lesson/RenderPreloadLoading';
import RenderPreloadLoaded from '../components/Lesson/RenderPreloadLoaded';
import SpeechDashboard from '../components/Lesson/SpeechDashboard';
import Upload from '../components/Upload/Upload';

ReactOnRails.register({
  Lesson,
  RenderResultDev,
  RenderRecordDev,
  RenderPreloadLoading,
  RenderPreloadLoaded,
  SpeechDashboard,
  Upload
});
