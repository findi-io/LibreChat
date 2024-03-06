import { useRecoilState } from 'recoil';
import { Switch } from '~/components/ui';
import { useLocalize } from '~/hooks';
import store from '~/store';

export default function WriterModeSwitch({
  onCheckedChange,
}: {
  onCheckedChange?: (value: boolean) => void;
}) {
  const [writerMode, setWriterMode] = useRecoilState<boolean>(store.writerMode);
  const localize = useLocalize();

  const handleCheckedChange = (value: boolean) => {
    setWriterMode(value);
    if (onCheckedChange) {
      onCheckedChange(value);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>{localize('com_nav_writer_mode')} </div>
      <Switch
        id="writerMode"
        checked={writerMode}
        onCheckedChange={handleCheckedChange}
        className="ml-4 mt-2"
        data-testid="writerMode"
      />
    </div>
  );
}
