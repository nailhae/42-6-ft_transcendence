import Avatar from '@mui/material/Avatar';
import { useState, useContext, useEffect } from 'react';
import ProfileModar from '@/component/common/detailProfile/profileModar';
import ProfileMenus from '@/component/common/detailProfile/profileMenus';
import ProfilePageBody from '@/component/common/detailProfile/profilePageBody';
import Block from '@/type/block.type';
import User, { UserStatus } from '@/type/user.type';
import { useRouter } from 'next/navigation';
import { getFetcher } from '@/service/api';
import AuthContext from '@/context/auth.context';
import Image from 'next/image';
import { UNKNOWN_PROFILE_IMAGE_URI } from '@/common/constant';
import Loading from '../Loading';
import CustomSnackbar from '../customSnackbar';
import Friend from '@/type/friend.type';
import CustomImage from '@/component/common/CustomImage';

interface OpenProfileAvatarProps {
	otherUserId: string;
	imgUrl: string | undefined | null;
	refetch?: () => void;
}

const OpenProfileAvatar = ({ otherUserId, imgUrl, refetch }: OpenProfileAvatarProps) => {
	const router = useRouter();
	const { me } = useContext(AuthContext);
	const isMe = me?.id ? me.id === otherUserId : false;

	const [otherUserData, setOtherUserData] = useState<User>({
		id: '',
		nickname: '',
		profileImageURI: undefined,
		status: UserStatus.OFFLINE,
	});
	const [isBlockUser, setIsBlockUser] = useState<boolean | undefined>(undefined);
	const [isFriend, setIsFriend] = useState<Boolean | undefined>(undefined);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [click, setClick] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [friendList, blockList, userData] = await Promise.all([
					getFetcher<Friend[]>('/friend'),
					getFetcher<Block[]>('/block'),
					getFetcher<User>(`/user/${otherUserId}`),
				]);

				setOtherUserData(userData);
				setIsFriend(friendList.some(friend => friend.friendId === userData.id));
				setIsBlockUser(blockList.some(blockedUser => blockedUser.blockedId === otherUserId));
			} catch (error: any) {
				setErrorMessage(error.message);
			}
		};
		if (click === true) {
			fetchData();
		}
	}, [otherUserId, click, isBlockUser, otherUserData.isFriend]);

	const handleAvatarOpen = () => {
		if (isMe) {
			router.push('/profile/myProfile');
		} else {
			setClick(true);
		}
	};

	const handleSnackbarClose = () => {
		setErrorMessage('');
	};

	return imgUrl === null ? (
		<Loading />
	) : (
		<>
			<CustomSnackbar
				open={errorMessage !== '' ? true : false}
				success={false}
				onClose={handleSnackbarClose}
			>
				{errorMessage}
			</CustomSnackbar>
			<Avatar onClick={handleAvatarOpen} sx={{ cursor: 'pointer' }}>
				{imgUrl === '' ? (
					<CustomImage img={UNKNOWN_PROFILE_IMAGE_URI} alt={'user img'} />
				) : (
					<CustomImage
						useLoader
						img={imgUrl as string}
						alt="user img"
					/>
				)}
			</Avatar>
			{click && isBlockUser !== undefined && isFriend !== undefined && (
				<ProfileModar
						setClick={setClick}
						childMenu={<ProfileMenus isblock={isBlockUser} otherUserId={otherUserId} />} >
					<ProfilePageBody userData={otherUserData} isBlock={isBlockUser} refetch={refetch} isFriend={isFriend} setIsFriend={setIsFriend} />
				</ProfileModar>
			)}
		</>
	);
};

export default OpenProfileAvatar;
