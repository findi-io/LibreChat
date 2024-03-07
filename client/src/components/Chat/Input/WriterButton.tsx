import { useRecoilState } from 'recoil';
import { Settings2 } from 'lucide-react';
import { Root, Anchor } from '@radix-ui/react-popover';
import { useState, useEffect, useMemo } from 'react';
import { tPresetUpdateSchema, EModelEndpoint } from 'librechat-data-provider';
import type { TPreset } from 'librechat-data-provider';
import { EndpointSettings, SaveAsPresetDialog } from '~/components/Endpoints';
import { ModelSelect } from '~/components/Input/ModelSelect';
import { PluginStoreDialog } from '~/components';
import OptionsPopover from './OptionsPopover';
import PopoverButtons from './PopoverButtons';
import { useSetIndexOptions } from '~/hooks';
import { useChatContext } from '~/Providers';
import { Button } from '~/components/ui';
import { cn, cardStyle } from '~/utils/';
import store from '~/store';
import { Link, useLocation } from 'react-router-dom';

export default function WriterButton() {

  const { showPopover, conversation, latestMessage, setShowPopover, setShowBingToneSetting } =
    useChatContext();

  const { endpoint, conversationId, jailbreak } = conversation ?? {};
  const location = useLocation();
  const display = conversationId != "new" && location.pathname.startsWith("/c/")

  return (
    <Root
      open={showPopover}
      // onOpenChange={} //  called when the open state of the popover changes.
    >
      <Anchor>
        <div className="my-auto lg:max-w-2xl xl:max-w-3xl">
          <span className="flex w-full flex-col items-center justify-center gap-0 md:order-none md:m-auto md:gap-2">
            <div className="z-[61] flex w-full items-center justify-center gap-2">

            { display && 
                <Link
                type="button"
                className={cn(
                  cardStyle,
                  'min-w-4 z-50 flex h-[40px] flex-none items-center justify-center px-3 focus:ring-0 focus:ring-offset-0',
                  'hover:bg-gray-50 radix-state-open:bg-gray-50 dark:hover:bg-black/10 dark:radix-state-open:bg-black/20'
                )} to={`/w/${conversationId}`}                >
                  Writing Mode
                </Link>
              }
            </div>
            

          </span>
        </div>
      </Anchor>
    </Root>
  );
}
