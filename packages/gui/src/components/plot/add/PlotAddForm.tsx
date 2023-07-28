import { defaultPlotter } from '@bpx-network/api';
import { useStartPlottingMutation } from '@bpx-network/api-react';
import { Back, useShowError, ButtonLoading, Flex, Form } from '@bpx-network/core';
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
import PlotAddSelectTemporaryDirectory from './PlotAddSelectTemporaryDirectory';
import PlotAddChooseFingerprint from './PlotAddChooseFingerprint';

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

  const { watch, setValue, reset } = methods;
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
  const allowTempDirectorySelection: boolean = plotter.options.haveBladebitOutputDir === false;

  const handlePlotterChanged = (newPlotterName: PlotterName) => {
    const defaults = defaultsForPlotter(newPlotterName);
    reset(defaults);
  };

  const handleSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      setLoading(true);
      const { delay, ...rest } = data;

      const plotAddConfig = {
        ...rest,
        delay: delay * 60,
      };

      await startPlotting(plotAddConfig).unwrap();

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
        <PlotAddNumberOfPlots step={step++} plotter={plotter} />
        {allowTempDirectorySelection && <PlotAddSelectTemporaryDirectory step={step++} plotter={plotter} />}
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
