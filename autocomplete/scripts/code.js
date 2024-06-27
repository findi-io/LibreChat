/**
 *
 * (c) Copyright Ascensio System SIA 2020
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { SSE } from '../vendor/sse.js';
(function(window, undefined){

  window.isInit = false;

  window.Asc.plugin.init = function(text)
  {
    if (!window.isInit)
    {
      window.isInit = true;

      window.Asc.plugin.currentText = '';
      window.Asc.plugin.createInputHelper();
      window.Asc.plugin.getInputHelper().createWindow();
	  console.log(window.Asc.plugin.info.documentTitle);

	  const source = new SSE(`/stream-sse2?filename=${window.Asc.plugin.info.documentTitle}`);

      source.addEventListener('message', function (event) {
        console.log(event.data);
        eval(`window.Asc.plugin.callCommand(function(data) {
			const oPresentation = Api.GetPresentation();
			const oSlideFromJSON = Api.FromJSON('${event.data}');
			oPresentation.AddSlide(oSlideFromJSON);
			Api.Save();
		  });
		`);
      });

      source.stream();
    }
  };


})(window, undefined);
