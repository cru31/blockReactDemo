import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Lock, Unlock, ListFilter, X, CheckCircle, ArrowRight, Shield, Plus, ChevronRight, Gauge, BarChart2, Settings, Trash, User, Check, ArrowLeft } from 'lucide-react';

// 모의 데이터
const INITIAL_MOCK_APPS = [
  { id: 'com.facebook', name: 'Facebook', icon: '📱' },
  { id: 'com.instagram', name: 'Instagram', icon: '📷' },
  { id: 'com.twitter', name: 'Twitter', icon: '🐦' },
  { id: 'com.youtube', name: 'YouTube', icon: '📺' },
  { id: 'com.tiktok', name: 'TikTok', icon: '🎵' }
];

// 초기 프로필
const INITIAL_PROFILES = [
  {
    id: '1',
    name: '업무 시간',
    appBundleIds: ['com.facebook', 'com.instagram', 'com.twitter'],
    websiteURLs: ['facebook.com', 'instagram.com', 'twitter.com'],
    scheduleStart: new Date(new Date().getTime() + 5 * 60000).toISOString(),
    scheduleEnd: new Date(new Date().getTime() + 65 * 60000).toISOString(),
    isActive: false
  },
  {
    id: '2',
    name: '공부 시간',
    appBundleIds: ['com.youtube', 'com.netflix'],
    websiteURLs: ['youtube.com', 'netflix.com'],
    scheduleStart: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
    scheduleEnd: new Date(new Date().setHours(22, 0, 0, 0)).toISOString(),
    isActive: false
  }
];

// 메인 앱 컴포넌트
export default function LockToFocusApp() {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [activeTab, setActiveTab] = useState("blockSettings");
  const [mockApps, setMockApps] = useState(INITIAL_MOCK_APPS);
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);
  
  const renderContent = () => {
    switch (activeTab) {
      case "blockSettings":
        return <BlockSettingsScreen mockApps={mockApps} />;
      case "dashboard":
        return <DummyScreen title="대시보드" />;
      case "stats":
        return <DummyScreen title="통계" />;
      default:
        return <BlockSettingsScreen mockApps={mockApps} />;
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {!isAuthorized ? (
        <div className="p-4 text-center">권한 요청 화면</div>
      ) : (
        <>
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
              <button
                onClick={() => setIsDebugModalOpen(true)}
                className="text-gray-500 hover:text-blue-600 flex items-center text-sm"
              >
                <Settings className="w-4 h-4 mr-1" />
                디버그 설정
              </button>
            </div>
            {renderContent()}
          </div>
          
          <nav className="bg-white border-t border-gray-200 flex justify-around py-2">
            <TabButton 
              icon={<Lock className="w-6 h-6" />} 
              label="차단 설정" 
              isActive={activeTab === "blockSettings"} 
              onClick={() => setActiveTab("blockSettings")} 
            />
            <TabButton 
              icon={<Gauge className="w-6 h-6" />} 
              label="대시보드" 
              isActive={activeTab === "dashboard"} 
              onClick={() => setActiveTab("dashboard")} 
            />
            <TabButton 
              icon={<BarChart2 className="w-6 h-6" />} 
              label="통계" 
              isActive={activeTab === "stats"} 
              onClick={() => setActiveTab("stats")} 
            />
          </nav>
          
          {isDebugModalOpen && (
            <DebugModal 
              mockApps={mockApps} 
              setMockApps={setMockApps} 
              onClose={() => setIsDebugModalOpen(false)} 
            />
          )}
        </>
      )}
    </div>
  );
}

// 디버그 모달 컴포넌트
function DebugModal({ mockApps, setMockApps, onClose }) {
  const [newAppData, setNewAppData] = useState({ id: '', name: '', icon: '' });
  const [editedApps, setEditedApps] = useState([...mockApps]);
  
  const handleAddApp = () => {
    if (newAppData.id && newAppData.name) {
      setEditedApps([...editedApps, { ...newAppData, icon: newAppData.icon || '📱' }]);
      setNewAppData({ id: '', name: '', icon: '' });
    }
  };
  
  const handleRemoveApp = (index) => {
    const updatedApps = [...editedApps];
    updatedApps.splice(index, 1);
    setEditedApps(updatedApps);
  };
  
  const handleUpdateApp = (index, field, value) => {
    const updatedApps = [...editedApps];
    updatedApps[index] = { ...updatedApps[index], [field]: value };
    setEditedApps(updatedApps);
  };
  
  const handleSave = () => {
    setMockApps(editedApps);
    onClose();
  };
  
  const handleReset = () => {
    setEditedApps([...INITIAL_MOCK_APPS]);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-4/5 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">디버그 데이터 설정</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-6">
            <h3 className="font-medium mb-2">앱 데이터 관리</h3>
            <div className="border rounded-lg">
              <div className="grid grid-cols-12 gap-2 p-3 bg-gray-50 border-b font-medium text-sm">
                <div className="col-span-3">앱 ID</div>
                <div className="col-span-4">앱 이름</div>
                <div className="col-span-3">아이콘</div>
                <div className="col-span-2">작업</div>
              </div>
              
              {editedApps.map((app, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 p-3 border-b items-center text-sm">
                  <div className="col-span-3">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      value={app.id}
                      onChange={(e) => handleUpdateApp(index, 'id', e.target.value)}
                    />
                  </div>
                  <div className="col-span-4">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      value={app.name}
                      onChange={(e) => handleUpdateApp(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      value={app.icon}
                      onChange={(e) => handleUpdateApp(index, 'icon', e.target.value)}
                      placeholder="이모지"
                    />
                  </div>
                  <div className="col-span-2">
                    <button 
                      onClick={() => handleRemoveApp(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="grid grid-cols-12 gap-2 p-3 items-center bg-gray-50 text-sm">
                <div className="col-span-3">
                  <input
                    type="text"
                    className="w-full p-1 border rounded"
                    value={newAppData.id}
                    onChange={(e) => setNewAppData({...newAppData, id: e.target.value})}
                    placeholder="com.example"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="text"
                    className="w-full p-1 border rounded"
                    value={newAppData.name}
                    onChange={(e) => setNewAppData({...newAppData, name: e.target.value})}
                    placeholder="앱 이름"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    className="w-full p-1 border rounded"
                    value={newAppData.icon}
                    onChange={(e) => setNewAppData({...newAppData, icon: e.target.value})}
                    placeholder="이모지"
                  />
                </div>
                <div className="col-span-2">
                  <button 
                    onClick={handleAddApp}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    추가
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              기본값으로 초기화
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md font-medium mr-2"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// 더미 화면
function DummyScreen({ title }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">{title} 내용이 여기에 표시됩니다.</p>
      </div>
    </div>
  );
}

// 탭 버튼 컴포넌트
function TabButton({ icon, label, isActive, onClick }) {
  return (
    <button 
      className={`flex flex-col items-center justify-center px-4 py-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}

// 차단 설정 화면
function BlockSettingsScreen({ mockApps }) {
  // 여러 프로필 관리를 위한 상태
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [selectedProfileId, setSelectedProfileId] = useState(INITIAL_PROFILES[0].id);
  const [isActive, setIsActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  
  // 모달 상태
  const [isAppSelectionOpen, setIsAppSelectionOpen] = useState(false);
  const [isWebsiteEditOpen, setIsWebsiteEditOpen] = useState(false);
  const [isTimeSettingOpen, setIsTimeSettingOpen] = useState(false);
  const [isProfileSelectionOpen, setIsProfileSelectionOpen] = useState(false);
  
  // 프로필 위저드 상태
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  
  // 현재 선택된 프로필 가져오기
  const selectedProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
  
  // 앱 정보 가져오기 함수
  const getAppInfo = (appId) => {
    return mockApps.find(app => app.id === appId) || { name: appId, icon: '📱' };
  };
  
  // 웹사이트 아이콘 가져오기 함수
  const getWebsiteIcon = (url) => {
    const icons = {
      'facebook.com': '📘',
      'instagram.com': '📸',
      'twitter.com': '🐤',
      'youtube.com': '📺'
    };
    
    for (const [site, icon] of Object.entries(icons)) {
      if (url.includes(site)) {
        return icon;
      }
    }
    
    return '🌐';
  };
  
  // 프로필 업데이트 헬퍼 함수
  const updateProfile = (updatedProfile) => {
    const updatedProfiles = profiles.map(p => 
      p.id === updatedProfile.id ? updatedProfile : p
    );
    setProfiles(updatedProfiles);
  };
  
  // 새 프로필 추가 함수
  const addProfile = (newProfile) => {
    const profileWithId = {
      ...newProfile,
      id: Math.random().toString(36).substr(2, 9)
    };
    setProfiles([...profiles, profileWithId]);
    return profileWithId.id; // 새로 생성된 ID 반환
  };
  
  useEffect(() => {
    if (isActive) {
      const timer = setInterval(() => {
        const now = new Date();
        const endTime = new Date(selectedProfile.scheduleEnd);
        
        if (now < endTime) {
          setRemainingTime(Math.floor((endTime - now) / 1000));
        } else {
          setRemainingTime(0);
          setIsActive(false);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isActive, selectedProfile]);
  
  const handleActivate = () => {
    setIsActive(true);
    // 현재 프로필의 활성 상태 업데이트
    const updatedProfile = { ...selectedProfile, isActive: true };
    updateProfile(updatedProfile);
  };
  
  const handleDeactivate = () => {
    setIsActive(false);
    setRemainingTime(null);
    // 현재 프로필의 활성 상태 업데이트
    const updatedProfile = { ...selectedProfile, isActive: false };
    updateProfile(updatedProfile);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };
  
  return (
    <div className="container mx-auto p-4 max-w-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">차단 설정</h1>
      </div>
      
      {/* 프로필 선택 섹션 */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
        {isActive ? (
          <>
            <div>
              <h2 className="font-semibold">{selectedProfile.name}</h2>
              <p className="text-sm text-green-600">집중 모드 활성화됨</p>
            </div>
            <button 
              onClick={handleDeactivate}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded-full"
            >
              중지
            </button>
          </>
        ) : (
          <>
            <div className="flex-1">
              <input
                type="text"
                value={selectedProfile.name}
                onChange={(e) => {
                  const updatedProfile = { ...selectedProfile, name: e.target.value };
                  updateProfile(updatedProfile);
                }}
                className="font-semibold bg-transparent outline-none w-full"
                placeholder="집중 프로필 이름"
              />
            </div>
            <button
              onClick={() => setIsProfileSelectionOpen(true)}
              className="text-blue-600"
            >
              <ListFilter className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
      
      {isActive ? (
        // 활성 모드일 때 표시
        <div className="space-y-4">
          {/* 차단 앱 섹션 - 활성화 상태 */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-3">
              <div className="text-blue-600 mr-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-medium">차단 앱 설정</h3>
            </div>
            {selectedProfile.appBundleIds.length > 0 ? (
              <div className="flex flex-wrap">
                {selectedProfile.appBundleIds.map((appId, index) => {
                  const app = getAppInfo(appId);
                  const marginLeft = index > 0 ? "-ml-3" : "";
                  return (
                    <div 
                      key={index} 
                      className={`w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full ${marginLeft} border-2 border-white`}
                      style={{zIndex: 10 - index}}
                    >
                      <span className="text-xl">{app.icon}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500">선택된 앱 없음</p>
            )}
          </div>
          
          {/* 차단 URL 섹션 - 활성화 상태 */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-3">
              <div className="text-blue-600 mr-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-medium">차단 URL 설정</h3>
            </div>
            {selectedProfile.websiteURLs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedProfile.websiteURLs.map((url, index) => (
                  <div 
                    key={index}
                    className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center"
                  >
                    <span className="mr-1">{getWebsiteIcon(url)}</span>
                    <span>{url}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">선택된 웹사이트 없음</p>
            )}
          </div>
          
          {/* 차단 시간 섹션 - 활성화 상태 */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-3">
              <div className="text-blue-600 mr-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-medium">차단 시간 상태</h3>
            </div>
            
            {remainingTime !== null ? (
              <div className="text-green-600">
                <p>차단 종료까지 {formatTime(remainingTime)} 남음</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${100 - (remainingTime / 3600) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">차단 상태 정보 없음</p>
            )}
          </div>
        </div>
      ) : (
        // 비활성 모드일 때 표시 (설정 화면)
        <div className="space-y-4">
          {/* 차단 앱 설정 카드 */}
          <div className="bg-white rounded-lg shadow p-4 flex items-center cursor-pointer hover:bg-gray-50" onClick={() => setIsAppSelectionOpen(true)}>
            <div className="text-blue-600 mr-4">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">차단 앱 설정</h3>
              <p className="text-sm text-gray-500">{`${selectedProfile.appBundleIds.length}개 앱 선택됨`}</p>
              
              {/* 앱 아이콘 미리보기 - 추가된 부분 */}
              {selectedProfile.appBundleIds.length > 0 && (
                <div className="flex mt-2">
                  {selectedProfile.appBundleIds.slice(0, 5).map((appId, index) => {
                    const app = getAppInfo(appId);
                    return (
                      <div 
                        key={index} 
                        className={`w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full -ml-1 first:ml-0 border border-white`}
                      >
                        <span className="text-lg">{app.icon}</span>
                      </div>
                    );
                  })}
                  {selectedProfile.appBundleIds.length > 5 && (
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full -ml-1 border border-white">
                      <span className="text-xs font-medium">+{selectedProfile.appBundleIds.length - 5}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
          
          {/* 차단 URL 설정 카드 */}
          <div className="bg-white rounded-lg shadow p-4 flex items-center cursor-pointer hover:bg-gray-50" onClick={() => setIsWebsiteEditOpen(true)}>
            <div className="text-blue-600 mr-4">
              <Lock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">차단 URL 설정</h3>
              <p className="text-sm text-gray-500">{`${selectedProfile.websiteURLs.length}개 웹사이트 입력됨`}</p>
              
              {/* 웹사이트 아이콘 미리보기 - 추가된 부분 */}
              {selectedProfile.websiteURLs.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedProfile.websiteURLs.slice(0, 3).map((url, index) => (
                    <div 
                      key={index}
                      className="px-2 py-1 bg-gray-100 rounded text-xs flex items-center"
                    >
                      <span className="mr-1">{getWebsiteIcon(url)}</span>
                      <span>{url}</span>
                    </div>
                  ))}
                  {selectedProfile.websiteURLs.length > 3 && (
                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">
                      외 {selectedProfile.websiteURLs.length - 3}개
                    </div>
                  )}
                </div>
              )}
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
          
          {/* 차단 시간 설정 카드 */}
          <SettingCard
            icon={<Clock className="w-5 h-5" />}
            title="차단 시간 설정"
            subtitle="1시간 (10:00 - 11:00)"
            onClick={() => setIsTimeSettingOpen(true)}
          />
          
          {/* 활성화 버튼 */}
          <button
            onClick={handleActivate}
            className="mt-2 w-full py-3 rounded-lg font-semibold bg-blue-600 text-white"
          >
            집중 모드 활성화
          </button>
        </div>
      )}
      
      {/* 앱 선택 모달 */}
      {isAppSelectionOpen && (
        <Modal title="차단할 앱 선택" onClose={() => setIsAppSelectionOpen(false)}>
          <div className="p-4">
            {mockApps.map(app => (
              <div
                key={app.id}
                className="p-3 border-b flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  const updatedProfile = { ...selectedProfile };
                  
                  if (updatedProfile.appBundleIds.includes(app.id)) {
                    updatedProfile.appBundleIds = updatedProfile.appBundleIds.filter(id => id !== app.id);
                  } else {
                    updatedProfile.appBundleIds = [...updatedProfile.appBundleIds, app.id];
                  }
                  
                  updateProfile(updatedProfile);
                }}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-xl">{app.icon}</span>
                  <span>{app.name}</span>
                </div>
                {selectedProfile.appBundleIds.includes(app.id) ? (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}
      
      {/* 웹사이트 편집 모달 */}
      {isWebsiteEditOpen && (
        <Modal title="차단할 웹사이트" onClose={() => setIsWebsiteEditOpen(false)}>
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-2">
              각 줄에 하나의 URL을 입력하세요.<br />
              예: facebook.com, twitter.com
            </p>
            <textarea
              className="w-full h-40 p-2 border rounded-md"
              placeholder="차단할 웹사이트 URL 입력..."
              defaultValue={selectedProfile.websiteURLs.join('\n')}
              onChange={(e) => {
                const urls = e.target.value
                  .split('\n')
                  .map(url => url.trim())
                  .filter(url => url !== '');
                
                const updatedProfile = { ...selectedProfile, websiteURLs: urls };
                updateProfile(updatedProfile);
              }}
            />
          </div>
        </Modal>
      )}
      
      {/* 시간 설정 모달 */}
      {isTimeSettingOpen && (
        <Modal title="차단 시간 설정" onClose={() => setIsTimeSettingOpen(false)}>
          <div className="p-4">
            <div className="flex border-b mb-4">
              <button className="flex-1 py-2 font-medium text-center text-blue-600 border-b-2 border-blue-600">
                시간 범위 설정
              </button>
              <button className="flex-1 py-2 font-medium text-center text-gray-500">
                지속 시간 설정
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
              <input
                type="time"
                className="w-full p-2 border rounded-md"
                defaultValue="10:00"
                onChange={(e) => {
                  const now = new Date();
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  now.setHours(hours, minutes, 0, 0);
                  
                  const updatedProfile = { ...selectedProfile, scheduleStart: now.toISOString() };
                  updateProfile(updatedProfile);
                }}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
              <input
                type="time"
                className="w-full p-2 border rounded-md"
                defaultValue="11:00"
                onChange={(e) => {
                  const now = new Date();
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  now.setHours(hours, minutes, 0, 0);
                  
                  const updatedProfile = { ...selectedProfile, scheduleEnd: now.toISOString() };
                  updateProfile(updatedProfile);
                }}
              />
            </div>
          </div>
        </Modal>
      )}
      
      {/* 프로필 선택 모달 */}
      {isProfileSelectionOpen && (
        <ProfileSelectionModal 
          profiles={profiles}
          onSelectProfile={(profileId) => {
            setSelectedProfileId(profileId);
            setIsProfileSelectionOpen(false);
          }}
          onAddProfile={() => {
            setIsProfileSelectionOpen(false);
            setIsWizardOpen(true);
          }}
          onClose={() => setIsProfileSelectionOpen(false)}
        />
      )}
      
      {/* 프로필 생성 위저드 */}
      {isWizardOpen && (
        <ProfileWizard
          mockApps={mockApps}
          onComplete={(newProfile) => {
            const newProfileId = addProfile(newProfile);
            setSelectedProfileId(newProfileId);
            setIsWizardOpen(false);
          }}
          onCancel={() => setIsWizardOpen(false)}
        />
      )}
    </div>
  );
}

// 프로필 선택 모달
function ProfileSelectionModal({ profiles, onSelectProfile, onAddProfile, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">집중 프로필 선택</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="py-2 max-h-96 overflow-y-auto">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="p-4 border-b flex justify-between items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectProfile(profile.id)}
            >
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{profile.name}</h3>
                  <p className="text-xs text-gray-500">
                    앱 {profile.appBundleIds.length}개 • 웹사이트 {profile.websiteURLs.length}개
                  </p>
                </div>
              </div>
              {profile.isActive && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  활성
                </span>
              )}
            </div>
          ))}
          
          {/* 프로필 추가 옵션 */}
          <div
            className="p-4 flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
            onClick={onAddProfile}
          >
            <div className="bg-blue-100 rounded-full p-2 mr-3">
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-medium">프로필 추가 +</h3>
          </div>
        </div>
        
        <div className="p-4 border-t">
          <button
            className="w-full py-2 bg-gray-200 text-gray-800 rounded-md font-medium"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

// 프로필 생성 위저드
function ProfileWizard({ mockApps, onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    name: "새 집중 프로필",
    appBundleIds: [],
    websiteURLs: [],
    scheduleStart: new Date().toISOString(),
    scheduleEnd: new Date(new Date().getTime() + 60 * 60000).toISOString(),
    isActive: false
  });
  
  const updateWizardData = (data) => {
    setWizardData({ ...wizardData, ...data });
  };
  
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(wizardData);
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };
  
  // 앱 정보 가져오기 함수
  const getAppInfo = (appId) => {
    return mockApps.find(app => app.id === appId) || { name: appId, icon: '📱' };
  };
  
  // 웹사이트 아이콘 가져오기 함수
  const getWebsiteIcon = (url) => {
    const icons = {
      'facebook.com': '📘',
      'instagram.com': '📸',
      'twitter.com': '🐤',
      'youtube.com': '📺'
    };
    
    for (const [site, icon] of Object.entries(icons)) {
      if (url.includes(site)) {
        return icon;
      }
    }
    
    return '🌐';
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">새 집중 프로필 만들기 {step}/4</h2>
          <button onClick={onCancel}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6">
          {/* 단계 진행 표시 */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    i === step ? 'bg-blue-600 text-white' : 
                    i < step ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i < step ? <Check className="w-5 h-5" /> : i}
                </div>
              ))}
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-blue-600"
                style={{ width: `${(step - 1) * 33.33}%` }}
              ></div>
            </div>
          </div>
          
          {/* 단계별 컨텐츠 */}
          {step === 1 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">프로필 이름</h3>
              <input
                type="text"
                className="w-full p-3 border rounded-md mb-2"
                value={wizardData.name}
                onChange={(e) => updateWizardData({ name: e.target.value })}
                placeholder="집중 프로필 이름 입력"
              />
              <p className="text-sm text-gray-500">
                이 프로필을 쉽게 식별할 수 있는 이름을 입력하세요.
              </p>
            </div>
          )}
          
          {step === 2 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">차단할 앱 선택</h3>
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {mockApps.map(app => (
                  <div
                    key={app.id}
                    className="p-3 border-b flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      let updatedAppIds = [...wizardData.appBundleIds];
                      
                      if (updatedAppIds.includes(app.id)) {
                        updatedAppIds = updatedAppIds.filter(id => id !== app.id);
                      } else {
                        updatedAppIds.push(app.id);
                      }
                      
                      updateWizardData({ appBundleIds: updatedAppIds });
                    }}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-xl">{app.icon}</span>
                      <span>{app.name}</span>
                    </div>
                    {wizardData.appBundleIds.includes(app.id) ? (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* 선택된 앱 미리보기 */}
              {wizardData.appBundleIds.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">선택된 앱 {wizardData.appBundleIds.length}개</p>
                  <div className="flex flex-wrap">
                    {wizardData.appBundleIds.map((appId, index) => {
                      const app = getAppInfo(appId);
                      return (
                        <div 
                          key={index}
                          className="mr-2 mb-2 px-2 py-1 bg-blue-50 rounded-md flex items-center"
                        >
                          <span className="mr-1">{app.icon}</span>
                          <span className="text-sm">{app.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {step === 3 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">차단할 웹사이트 입력</h3>
              <p className="text-sm text-gray-500 mb-2">
                각 줄에 하나의 URL을 입력하세요.<br />
                예: facebook.com, twitter.com
              </p>
              <textarea
                className="w-full h-40 p-2 border rounded-md mb-4"
                placeholder="차단할 웹사이트 URL 입력..."
                value={wizardData.websiteURLs.join('\n')}
                onChange={(e) => {
                  const urls = e.target.value
                    .split('\n')
                    .map(url => url.trim())
                    .filter(url => url !== '');
                  
                  updateWizardData({ websiteURLs: urls });
                }}
              />
              
              {/* 입력된 웹사이트 미리보기 */}
              {wizardData.websiteURLs.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">입력된 웹사이트 {wizardData.websiteURLs.length}개</p>
                  <div className="flex flex-wrap gap-2">
                    {wizardData.websiteURLs.map((url, index) => (
                      <div 
                        key={index}
                        className="px-2 py-1 bg-blue-50 rounded-md text-sm flex items-center"
                      >
                        <span className="mr-1">{getWebsiteIcon(url)}</span>
                        <span>{url}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {step === 4 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">차단 시간 설정</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  defaultValue="10:00"
                  onChange={(e) => {
                    const now = new Date();
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    now.setHours(hours, minutes, 0, 0);
                    updateWizardData({ scheduleStart: now.toISOString() });
                  }}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  defaultValue="11:00"
                  onChange={(e) => {
                    const now = new Date();
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    now.setHours(hours, minutes, 0, 0);
                    updateWizardData({ scheduleEnd: now.toISOString() });
                  }}
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-800 mb-2">설정 요약</h4>
                <p className="text-sm text-blue-700 mb-1">
                  <span className="font-medium">프로필:</span> {wizardData.name}
                </p>
                <p className="text-sm text-blue-700 mb-1">
                  <span className="font-medium">차단 앱:</span> {wizardData.appBundleIds.length}개
                </p>
                <p className="text-sm text-blue-700 mb-1">
                  <span className="font-medium">차단 웹사이트:</span> {wizardData.websiteURLs.length}개
                </p>
                <p className="text-sm text-blue-700 mb-1">
                  <span className="font-medium">차단 시간:</span> 1시간 (10:00 - 11:00)
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-between">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md font-medium"
            onClick={handleBack}
          >
            {step === 1 ? '취소' : '이전'}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
            onClick={handleNext}
            disabled={step === 1 && wizardData.name.trim() === ''}
          >
            {step === 4 ? '완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
}

// 설정 카드 컴포넌트
function SettingCard({ icon, title, subtitle, onClick }) {
  return (
    <div 
      className="bg-white rounded-lg shadow p-4 flex items-center cursor-pointer hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="text-blue-600 mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400" />
    </div>
  );
}

// 모달 컴포넌트
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {children}
        
        <div className="p-4 border-t">
          <button
            className="w-full py-2 bg-blue-600 text-white rounded-md font-medium"
            onClick={onClose}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}