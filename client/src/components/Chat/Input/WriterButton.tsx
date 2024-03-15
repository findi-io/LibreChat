import { useChatContext } from '~/Providers';
import { cn, cardStyle } from '~/utils/';
import { Link, useLocation } from 'react-router-dom';

export default function WriterButton() {
  const { conversation } = useChatContext();

  const { conversationId } = conversation ?? {};
  const location = useLocation();
  const display = conversationId != 'new' && location.pathname.startsWith('/c/');

  return (
    <div className="my-auto lg:max-w-2xl xl:max-w-3xl">
      <span className="flex w-full flex-col items-center justify-center gap-0 md:order-none md:m-auto md:gap-2">
        <div className="z-[61] flex w-full items-center justify-center gap-2">
          {display && (
            <Link
              type="button"
              className={cn(
                cardStyle,
                'z-50 flex h-[40px] min-w-4 flex-none items-center justify-center px-3 focus:ring-0 focus:ring-offset-0',
                'hover:bg-gray-50 radix-state-open:bg-gray-50 dark:hover:bg-black/10 dark:radix-state-open:bg-black/20',
              )}
              to={`/w/${conversationId}`}
            >
              Writing Mode
            </Link>
          )}
        </div>
      </span>
    </div>
  );
}
