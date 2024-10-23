import { defaultPlotter } from '@bpx-chain/api';
import { useStartPlottingMutation } from '@bpx-chain/api-react';
import { Back, useShowError, ButtonLoading, Flex, Form } from '@bpx-chain/core';
import { t, Trans } from '@lingui/macro';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router';

import PlotterName from '../../../constants/PlotterName';
import { plottingInfo } from '../../../constants/plotSizes';
import PlotAddConfig from '../../../types/PlotAdd';
import { PlotterDefaults, PlotterOptions } from '../../../types/Plotter';
import PlotAddChoosePlotter from './PlotAddChoosePlotter';
import PlotAddChooseSize from './PlotAddChooseSize';
import PlotAddNumberOfPlots from './PlotAddNumberOfPlots';
import PlotAddSelectFinalDirectory from './PlotAddSelectFinalDirectory';
import PlotAddChooseFingerprint from './PlotAddChooseFingerprint';
import PlotAddSelectHybridDiskMode from './PlotAddSelectHybridDiskMode';

type FormData = PlotAddConfig;

type Props = {
  fingerprints: any;
  plotters: Record<
    PlotterName,
    {
      displayName: string;
      version: string;
      options: PlotterOptions;
      defaults: PlotterDefaults;
      installInfo: {
        installed: boolean;
        canInstall: boolean;
        bladebitMemoryWarning?: string;
      };
    }
  >;
};

export default function PlotAddForm(props: Props) {
  const { fingerprints, plotters } = props;

  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const showError = useShowError();

  const [startPlotting] = useStartPlottingMutation();
  const { state } = useLocation();

  const otherDefaults = {
    plotCount: 1,
    queue: 'default',
    finalLocation: '',
    workspaceLocation: '',
    workspaceLocation2: '',
    excludeFinalDir: false,
    fingerprint: fingerprints[0].fingerprint,
    farmerPublicKey: fingerprints[0].farmerPk,
    poolPublicKey: fingerprints[0].poolPk,
  };

  const defaultsForPlotter = (plotterName: PlotterName) => {
    const plotterDefaults = plotters[plotterName]?.defaults ?? defaultPlotter.defaults;
    const { plotSize } = plotterDefaults;
    const maxRam = plottingInfo[plotterName].find((element) => element.value === plotSize)?.defaultRam;
    const defaults = {
      ...plotterDefaults,
      ...otherDefaults,
      maxRam,
    };

    return defaults;
  };

  const methods = useForm<FormData>({
    defaultValues: defaultsForPlotter(PlotterName.CHIAPOS),
  });

  const { watch, setValue, reset, getValues } = methods;
  const plotterName = watch('plotterName') as PlotterName;
  const plotSize = watch('plotSize');

  useEffect(() => {
    const plotSizeConfig = plottingInfo[plotterName].find((item) => item.value === plotSize);
    if (plotSizeConfig) {
      setValue('maxRam', plotSizeConfig.defaultRam);
    }
  }, [plotSize, plotterName, setValue]);

  const plotter = plotters[plotterName] ?? defaultPlotter;
  let step = 1;

  const handlePlotterChanged = (newPlotterName: PlotterName) => {
    const defaults = defaultsForPlotter(newPlotterName);
    const formValues = getValues();
    reset({
        ...defaults,
        fingerprint: formValues.fingerprint,
        farmerPublicKey: formValues.farmerPublicKey,
        poolPublicKey: formValues.poolPublicKey,
    });
  };

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const {
          delay,
          workspaceLocation,
          workspaceLocation2,
          bladebitEnableHybridDiskMode,
          farmerPublicKey,
          poolPublicKey,
          ...rest
      } = data;
      
      if (bladebitEnableHybridDiskMode && !workspaceLocation) {
        throw new Error(t`Temp folder location is required for hybrid disk plotting with 16/128G RAM`);
      }

      const plotAddConfig = {
        ...rest,
        delay: delay * 60,
        workspaceLocation,
        workspaceLocation2: workspaceLocation2 || workspaceLocation,
        bladebitEnableDisk128Mode: bladebitEnableHybridDiskMode === '128' ? true : undefined,
        bladebitEnableDisk16Mode: bladebitEnableHybridDiskMode === '16' ? true : undefined,
        farmerPublicKey: farmerPublicKey.startsWith('0x') ? farmerPublicKey.slice(2) : farmerPublicKey,
        poolPublicKey: poolPublicKey.startsWith('0x') ? poolPublicKey.slice(2) : poolPublicKey,
      };

      await startPlotting({ plotAddConfig }).unwrap();

      navigate('/dashboard/plot');
    } catch (error) {
      await showError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <Flex flexDirection="column" gap={3}>
        <Back variant="h5" form>
          <Trans>Add a Plot</Trans>
        </Back>
        <PlotAddChoosePlotter step={step++} onChange={handlePlotterChanged} />
        <PlotAddChooseFingerprint step={step++} fingerprints={fingerprints} />
        <PlotAddChooseSize step={step++} plotter={plotter} />
        {plotterName === PlotterName.BLADEBIT_CUDA && <PlotAddSelectHybridDiskMode step={step++} plotter={plotter} />}
        <PlotAddNumberOfPlots step={step++} plotter={plotter} />
        <PlotAddSelectFinalDirectory step={step++} plotter={plotter} />
        <Flex justifyContent="flex-end">
          <ButtonLoading loading={loading} color="primary" type="submit" variant="contained">
            <Trans>Create</Trans>
          </ButtonLoading>
        </Flex>
      </Flex>
    </Form>
  );
}
