import { Avatar } from '../avatar/avatar';
import { Company } from '../../mock/mock-companies';
import { CrownIcon } from '../icons';

const getCompanyInitials = (
  companyName: string
): { name: string; surname: string } => {
  const words = companyName
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (words.length >= 2) {
    return {
      surname: words[0][0].toUpperCase(),
      name: words[1][0].toUpperCase(),
    };
  } else if (words.length === 1) {
    const word = words[0];
    return {
      surname: word[0]?.toUpperCase() || 'C',
      name: word[1]?.toUpperCase() || 'O',
    };
  }

  return { surname: 'C', name: 'O' };
};

interface CompanyAvatarProps {
  company: Company;
  size?: 'xs' | 'sm' | 'ssm' | 'md' | 'lg' | 'xl' | 'xxl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'lsm';
  showCrown?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function CompanyAvatar({
  company,
  size = 'ssm',
  rounded = 'md',
  showCrown = false,
  showTooltip = true,
  className,
}: CompanyAvatarProps) {
  return (
    <div className={`relative flex-shrink-0 ${className || ''}`}>
      <Avatar
        row={{
          original: {
            client: {
              ...getCompanyInitials(company.name),
              avatarSrc: company.avatarSrc,
            },
          },
        }}
        size={size}
        rounded={rounded}
        showTooltip={showTooltip}
      />
      {showCrown && (
        <span className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 flex-shrink-0">
          <CrownIcon className="w-3 h-3 rounded-full flex-none" />
        </span>
      )}
    </div>
  );
}

