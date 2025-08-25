import { type UseFormReturn, useFieldArray } from 'react-hook-form';
import { TextField } from '@/components/shared/Form/TextField';
import { type OrganizationFormData, MEMBER_POSITION_OPTIONS, OrganizationStatus } from '@/types/organization.types';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useContextDioceseDropdown, useContextChurchDropdown } from '@/hooks/shared/useDropdownData';
import { usePermissions } from '@/hooks/shared/usePermissions';
import { AsyncSelectDropdownField } from '../shared/Form/AsyncSelectDropdownField';
import { PhoneInputField } from '../shared/Form/PhoneInputField';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, UserCheck } from 'lucide-react';
import { DatePicker } from '../shared/date-picker/DatePicker';

interface OrganizationMembersFormProps {
  isEdit?: boolean;
  methods: UseFormReturn<OrganizationFormData>;
  organizationId?: string;
  onValidationChange?: (isValid: boolean) => void;
}

const OrganizationMembersForm: React.FC<OrganizationMembersFormProps> = ({ 
  methods, 
  isEdit, 
  organizationId, 
  onValidationChange 
}) => {
  const { t } = useTranslation();
  const {
    formState: { errors },
    register,
    control,
    setValue,
    watch,
  } = methods;

  const { isDioceseAdmin, isChurchAdmin } = usePermissions();

  // Watch for dioceseId changes to filter churches
  const selectedDiocese = watch('diocese');

  // Use context-aware dropdown for diocese and church
  const { data: dioceseOptions } = useContextDioceseDropdown();
  const { data: churchOptions } = useContextChurchDropdown(selectedDiocese?.id);

  // Use field array for dynamic members
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  // Watch members to handle leader logic
  const members = watch('members') || [];

  // Notify parent component when validation changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormValid());
    }
  }, [members, onValidationChange]);

  // Check if current member form is completely filled
  const isCurrentMemberFormComplete = (index: number) => {
    const member = members[index];
    if (!member) return false;

    // Required fields for any member
    const hasFirstName = member.firstName && member.firstName.trim() !== '';
    const hasPosition = member.position && member.position.trim() !== '';

    // If this member is leader, email is also required
    if (member.isLeader) {
      const hasEmail = member.email && member.email.trim() !== '';
      return hasFirstName && hasPosition && hasEmail;
    }

    return hasFirstName && hasPosition;
  };

  // Check if the last member form is complete (to enable adding new member)
  const canAddNewMember = () => {
    if (fields.length === 0) return true; // Can always add first member
    return isCurrentMemberFormComplete(fields.length - 1);
  };

  // Check if form is valid for submission
  const isFormValid = () => {
    if (fields.length === 0) return false; // Must have at least one member

    // Check if exactly one member is leader
    const leaderCount = members.filter((member) => member?.isLeader).length;
    if (leaderCount !== 1) return false;

    // Check if all members have required fields
    return members.every((member, index) => isCurrentMemberFormComplete(index));
  };

  // Handle leader toggle
  const handleLeaderToggle = (index: number, isChecked: boolean) => {
    if (isChecked) {
      // Turn off all other leader toggles
      members.forEach((_, memberIndex) => {
        if (memberIndex !== index) {
          setValue(`members.${memberIndex}.isLeader`, false);
        }
      });
    }
    setValue(`members.${index}.isLeader`, isChecked);
  };

  // Add new member
  const addMember = () => {
    append({
      firstName: '',
      lastName: '',
      email: '',
      phoneNo: '',
      position: '',
      isLeader: false,
      joinDate: new Date().toISOString().split('T')[0],
      status: OrganizationStatus.ACTIVE,
    });
  };

  // Remove member
  const removeMember = (index: number) => {
    // Don't allow removing if it's the only member
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Auto-select diocese for church admin
  useEffect(() => {
    if (isChurchAdmin && !isEdit && dioceseOptions?.data?.length === 1) {
      const selectedDiocese = dioceseOptions?.data[0];
      setValue('diocese', selectedDiocese);
      setValue('dioceseId', selectedDiocese?.id as string);
    }
  }, [isDioceseAdmin, isEdit, dioceseOptions, setValue]);

  // Auto-select church for church admin
  useEffect(() => {
    if (isChurchAdmin && !isEdit && churchOptions?.data?.length === 1) {
      const selectedChurch = churchOptions?.data[0];
      setValue('church', selectedChurch);
      setValue('churchId', selectedChurch?.id as string);
      setValue('dioceseId', selectedChurch?.dioceseId as string);
    }
  }, [isChurchAdmin, isEdit, churchOptions, setValue]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {t('organization.info.title')}
        </h3>

        {/* Organization Basic Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t('organization.info.name')}
                </p>
                <p className="text-base text-foreground">{watch('name') || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t('organization.info.type')}
                </p>
                <p className="text-base text-foreground">{watch('type')?.label || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t('organization.info.diocese')}
                </p>
                <p className="text-base text-foreground">{watch('diocese')?.label || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {t('organization.info.church')}
                </p>
                <p className="text-base text-foreground">{watch('church')?.label || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Members Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-base font-semibold text-foreground">
            {t('organization.organizationMembers.title') || 'Organization Members'}
          </h4>
          <Button onClick={addMember} disabled={!canAddNewMember()} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {t('organization.organizationMembers.addMember') || 'Add Member'}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Validation Error Messages */}
          {fields.length > 0 && (
            <>
              {members.filter((member) => member?.isLeader).length === 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    {t('organization.organizationMembers.noLeader') || 'Please designate one member as leader.'}
                  </p>
                </div>
              )}
              {members.filter((member) => member?.isLeader).length > 1 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    {t('organization.organizationMembers.multipleLeader') || 'Only one member can be designated as leader.'}
                  </p>
                </div>
              )}
            </>
          )}

          {fields.map((field, index) => {
            const isLeader = members[index]?.isLeader;
            const memberErrors = errors.members?.[index] as any;

            return (
              <Card key={field.id} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-foreground">
                        {t('organization.organizationMembers.member') || 'Member'} {index + 1}
                      </h5>
                      {isLeader && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          Leader
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`leader-${index}`} className="text-sm">
                          {t('organization.organizationMembers.leader') || 'Leader'}
                        </Label>
                        <Switch
                          id={`leader-${index}`}
                          checked={isLeader}
                          onCheckedChange={(checked) => handleLeaderToggle(index, checked)}
                        />
                      </div>
                      {fields.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <TextField
                        name={`members.${index}.firstName`}
                        label={t('organization.organizationMembers.firstName') || 'First Name'}
                        register={register}
                        validation={{ required: true }}
                        error={memberErrors?.firstName}
                        isMandatory={true}
                      />
                    </div>
                    <div>
                      <TextField
                        name={`members.${index}.lastName`}
                        label={t('organization.organizationMembers.lastName') || 'Last Name'}
                        register={register}
                        validation={{ required: false }}
                        error={memberErrors?.lastName}
                        isMandatory={false}
                      />
                    </div>
                    <div>
                      <TextField
                        name={`members.${index}.email`}
                        label={t('organization.organizationMembers.email') || 'Email'}
                        register={register}
                        validation={{
                          required: isLeader,
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        }}
                        error={memberErrors?.email}
                        isMandatory={isLeader}
                      />
                    </div>
                    <div>
                      <PhoneInputField
                        name={`members.${index}.phoneNo`}
                        label={t('organization.organizationMembers.phoneNo') || 'Phone Number'}
                        control={control}
                        validation={{ required: false }}
                        error={memberErrors?.phoneNo}
                        countryCode="IN"
                        isRequired={false}
                      />
                    </div>
                    <div>
                      <AsyncSelectDropdownField
                        name={`members.${index}.position`}
                        label={t('organization.organizationMembers.position') || 'Position'}
                        defaultOptions={MEMBER_POSITION_OPTIONS}
                        validation={{ required: true }}
                        control={control}
                        loadOptions={() => Promise.resolve(MEMBER_POSITION_OPTIONS)}
                        isRequired={true}
                      />
                    </div>
                    <div>
                      <TextField
                        name={`members.${index}.joinDate`}
                        label={t('organization.organizationMembers.joinDate') || 'Join Date'}
                        register={register}
                        validation={{ required: true }}
                        type="date"
                        error={memberErrors?.joinDate}
                        isMandatory={true}
                      />
                      <DatePicker
                        selected={new Date(field.joinDate)}
                        onSelect={(date) => setValue(`members.${index}.joinDate`, date ? date.toISOString() : '')}
                      />
                    </div>
                  </div>

                  {isLeader && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-700">
                        {t('organization.organizationMembers.leaderNote') || 'This member will be the organization leader and will receive login credentials.'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {fields.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-2">{t('organization.organizationMembers.noMembers') || 'No organization members added yet.'}</p>
            <Button variant="outline" onClick={addMember} disabled={!canAddNewMember()} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {t('organization.organizationMembers.addFirst') || 'Add First Member'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationMembersForm;